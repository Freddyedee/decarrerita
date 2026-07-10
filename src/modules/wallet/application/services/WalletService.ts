import { IWalletRepository } from "../../domain/ports/IWalletRepository"
import { IConfiguracionRepository } from "@/modules/configuracion/domain/repositories/IConfiguracionRepository";
import { IWalletService } from "../../domain/ports/IWalletServices";
import { Prisma } from "@prisma/client";


export class WalletService implements IWalletService { 

    constructor  (private readonly walletRepository: IWalletRepository, private readonly configRepository: IConfiguracionRepository){}

    private async getEmpresaUsuarioId(): Promise<number>{ 

        const valor = await this.configRepository.findByNombre("id_usuario_empresa");

        if (!valor) {
            throw new Error("id_usuario_empresa not configured");
        }
        return Number(valor);
    }

    private async getWallet(usuarioId: number) {
        const wallet = await this.walletRepository.findByUsuarioId(usuarioId);
        if (!wallet) {
            throw new Error(`Wallet not found for usuario ${usuarioId}`);
        }
        return wallet;
    }

     /**
     * RN-010: al iniciar el viaje, el cliente paga el costo
     * completo directamente a la wallet Empresa (no al chofer
     * todavía — el chofer cobra recién al completar).
     */

     async debitarCliente(clienteId: number, monto:number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void> { 

        const walletCliente = await this.walletRepository.findByUsuarioId(clienteId, tx); 
        const empresaId = await this.getEmpresaUsuarioId(); 
        const walletEmpresa = await this.walletRepository.findByUsuarioId(empresaId, tx); 

        walletCliente!.debitar(monto);

        await this.walletRepository.updateWithMovement(
            walletCliente!, "DEBITO_TRASLADO", monto, 
            walletCliente!.saldoDisponible + monto, trasladoId, 
            `Pago de traslado #${trasladoId}`
        );

        walletEmpresa!.acreditar(monto); 

        await this.walletRepository.updateWithMovement(
            walletEmpresa!, "COBRO_TRASLADO", monto, 
            walletEmpresa!.saldoDisponible - monto, trasladoId, 
            `Cobro de traslado #${trasladoId} (pendiente de reparto)`
        ); 
     }


      /**
     * RN-014/RN-015: al completar, la empresa reparte lo que
     * ya tiene retenido — acredita al chofer su parte y
     * conserva la comisión (que simplemente queda en su saldo,
     * sin necesidad de un movimiento adicional: ya estaba ahí
     * desde el débito del cliente).
     */

      async creditarChofer(choferId: number, monto: number, trasladoId: number): Promise <void>{

        const empresaId = await this.getEmpresaUsuarioId(); 
        const walletEmpresa = await this.getWallet(empresaId); 
        const walletChofer = await this.getWallet(choferId); 

        walletEmpresa.debitar(monto); 

        await this.walletRepository.updateWithMovement(
            walletEmpresa, "PAGO_CHOFER", monto, 
            walletEmpresa.saldoDisponible + monto, trasladoId, 
            `Pago a chofer por traslado #${trasladoId}`
        );
        
        walletChofer.acreditar(monto); 

        await this.walletRepository.updateWithMovement(
            walletChofer, "CREDITO_TRASLADO", monto, 
            walletChofer.saldoDisponible - monto, trasladoId, 
            `Cobro por traslado #${trasladoId}`
        ); 
      }

    /**
     * Cancelación antes de EN_CURSO: nadie pagó nada aún,
     * se descuenta la penalización fija directo de quien canceló.
     */

    async aplicarPenalizacion(usuarioId: number, monto: number, trasladoId: number, motivo: string): Promise<void> {
        
        const wallet = await this.getWallet(usuarioId); 
        wallet.debitar(monto); 

        await this.walletRepository.updateWithMovement(
            wallet, "PENALZIACION" , monto,
            wallet.saldoDisponible + monto, trasladoId, motivo 
        ); 
    }


    /**
     * Cancelación durante EN_CURSO: el cliente ya pagó a la
     * wallet Empresa. Se le reembolsa el costo menos la
     * penalización; la empresa retiene la penalización.
     */

    async reembolsarConPenalizacion(
        clienteId: number, montoTotal: number, penalizacion: number, trasladoId: number
    ): Promise<void> {

        const montoReembolso = montoTotal - penalizacion;

        const empresaId = await this.getEmpresaUsuarioId();
        const walletEmpresa = await this.getWallet(empresaId);
        const walletCliente = await this.getWallet(clienteId);

        walletEmpresa.debitar(montoReembolso);
        await this.walletRepository.updateWithMovement(
            walletEmpresa, "REEMBOLSO_TRASLADO", montoReembolso,
            walletEmpresa.saldoDisponible + montoReembolso, trasladoId,
            `Reembolso parcial traslado #${trasladoId} (penalización retenida: ${penalizacion})`
        );

        walletCliente.acreditar(montoReembolso);
        await this.walletRepository.updateWithMovement(
            walletCliente, "REEMBOLSO_TRASLADO", montoReembolso,
            walletCliente.saldoDisponible - montoReembolso, trasladoId,
            `Reembolso por cancelación de traslado #${trasladoId}`
        );
    }


    /**
     * RN-025: usa debitarPenalizacion() en vez de debitar() — la
     * penalización SIEMPRE se aplica, incluso si deja al usuario
     * en saldo negativo. La consecuencia de esa deuda se resuelve
     * en otro punto (canOperate), no bloqueando la penalización
     * misma. Esto es intencional: la empresa no debe perder el
     * derecho a cobrar la penalización solo porque el usuario no
     * tenga fondos en ese instante.
     */

    async applyPenalization(
        usuarioId:  number, monto: number, trasladoId: number, motivo: string, tx?: Prisma.TransactionClient
    ): Promise <void> {

        const wallet = await this.walletRepository.findByUsuarioId(usuarioId, tx); 

        if(!wallet) throw new Error(`Wallet not found for usuario ${usuarioId}`); 

        const previousBalance = wallet.saldoDisponible; 
        wallet.toDebitPenalization(monto);

        await this.walletRepository.updateWithMovement(wallet, "PENALIZACION", monto, previousBalance, trasladoId, motivo, tx); 

    }

    /**
     * RN-025: consulta de solo lectura, usada por Traslados ANTES
     * de permitir que un cliente solicite un viaje o que un chofer
     * acepte uno.
     */

    async canOperate(usuarioId: number): Promise <boolean> {

        const wallet = await this.walletRepository.findByUsuarioId(usuarioId); 

        if(!wallet) throw new Error (`Wallet not found for usuario ${usuarioId}`); 

        return wallet.canStartNewOperation();
    }
}