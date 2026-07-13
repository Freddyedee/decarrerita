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

    private async getWallet(usuarioId: number, tx? : Prisma.TransactionClient) {
        const wallet = await this.walletRepository.findByUsuarioId(usuarioId, tx);
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
            walletCliente!, "PAGO_TRASLADO", monto, 
            walletCliente!.saldoDisponible + monto, trasladoId, 
            `Pago de traslado #${trasladoId}`,
            tx
        );

        walletEmpresa!.acreditar(monto); 

        await this.walletRepository.updateWithMovement(
            walletEmpresa!, "PAGO_TRASLADO", monto, 
            walletEmpresa!.saldoDisponible - monto, trasladoId, 
            `Cobro de traslado #${trasladoId} (pendiente de reparto)`,
            tx
        ); 
     }


      /**
     * RN-014/RN-015: al completar, la empresa reparte lo que
     * ya tiene retenido — acredita al chofer su parte y
     * conserva la comisión (que simplemente queda en su saldo,
     * sin necesidad de un movimiento adicional: ya estaba ahí
     * desde el débito del cliente).
     */

      async creditarChofer(choferId: number, monto: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise <void>{

        const empresaId = await this.getEmpresaUsuarioId(); 
        const walletEmpresa = await this.getWallet(empresaId, tx); 
        const walletChofer = await this.getWallet(choferId, tx); 

        walletEmpresa.debitar(monto); 

        await this.walletRepository.updateWithMovement(
            walletEmpresa, "PAGO_TRASLADO", monto, 
            walletEmpresa.saldoDisponible + monto, trasladoId, 
            `Pago a chofer por traslado #${trasladoId}`,
            tx
        );
        
        walletChofer.acreditar(monto); 

        await this.walletRepository.updateWithMovement(
            walletChofer, "PAGO_TRASLADO", monto, 
            walletChofer.saldoDisponible - monto, trasladoId, 
            `Cobro por traslado #${trasladoId}`,
            tx
        ); 
      }

    /**
     * Cancelación antes de EN_CURSO: nadie pagó nada aún,
     * se descuenta la penalización fija directo de quien canceló.
     */

    async aplicarPenalizacion(usuarioId: number, monto: number, trasladoId: number, motivo: string, tx? : Prisma.TransactionClient): Promise<void> {
        
        const wallet = await this.walletRepository.findByUsuarioId(usuarioId, tx); 
        if(!wallet) throw new Error(`Wallet not found for usuario ${usuarioId}`); 

        console.log("=== APLICAR PENALIZACION ===");
        console.log("usuarioId:", usuarioId);
        console.log("monto a penalizar:", monto);
        console.log("saldo ANTES de penalizar:", wallet.saldoDisponible);

        const saldoAnterior = wallet.saldoDisponible; 
        wallet.debitarPenalizacion(monto); 

        await this.walletRepository.updateWithMovement(
            wallet, "PENALIZACION" , monto,
            saldoAnterior, trasladoId, motivo,
            tx
        ); 

        console.log("=== FIN APLICAR PENALIZACION ===");

    }


    /**
     * Cancelación durante EN_CURSO: el cliente ya pagó a la
     * wallet Empresa. Se le reembolsa el costo menos la
     * penalización; la empresa retiene la penalización.
     */

    async reembolsarConPenalizacion(
        clienteId: number, montoTotal: number, penalizacion: number, trasladoId: number, tx: Prisma.TransactionClient
    ): Promise<void> {

        const montoReembolso = montoTotal - penalizacion;

        const empresaId = await this.getEmpresaUsuarioId();
        const walletEmpresa = await this.walletRepository.findByUsuarioId(empresaId, tx); 
        if(!walletEmpresa) throw new Error(`wallet not found for usuario ${empresaId}`)
            
        const walletCliente = await this.walletRepository.findByUsuarioId(clienteId, tx);
        if(!walletCliente) throw new Error(`wallet not found for usuario ${clienteId}`);

        const saldoAnteriorEmpresa = walletEmpresa.saldoDisponible; 
        walletEmpresa.debitar(montoReembolso);


        await this.walletRepository.updateWithMovement(
            walletEmpresa, "REVERSO", montoReembolso,
            saldoAnteriorEmpresa, trasladoId, 
            `Reembolso parcial traslado #${trasladoId} (penalización retenida: ${penalizacion})`
        );

        const saldoAnteriorCliente = walletCliente.saldoDisponible; 

        walletCliente.acreditar(montoReembolso);
        await this.walletRepository.updateWithMovement(
            walletCliente, "REVERSO", montoReembolso,
            saldoAnteriorCliente, trasladoId,
            `Reembolso por cancelación de traslado #${trasladoId}`
        );
    }



    /**
     * RN-025: consulta de solo lectura, usada por Traslados ANTES
     * de permitir que un cliente solicite un viaje o que un chofer
     * acepte uno.
     */

    async puedeOperar(usuarioId: number): Promise <boolean> {

        const wallet = await this.walletRepository.findByUsuarioId(usuarioId); 

        if(!wallet) throw new Error (`Wallet not found for usuario ${usuarioId}`); 

        return wallet.puedeIniciarNuevaOperacion();
    }
}