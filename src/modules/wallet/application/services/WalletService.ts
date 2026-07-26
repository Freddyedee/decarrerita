import { IWalletRepository } from "../../domain/ports/IWalletRepository"
import { IConfiguracionRepository } from "@/modules/configuracion/domain/repositories/IConfiguracionRepository";
import { IWalletService } from "../../domain/ports/IWalletServices";
import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";


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
     * RN-010: Al iniciar el viaje, el cliente paga el costo
     * completo. El dinero SALE del cliente y ENTRA a la custodia
     * de la wallet Empresa.
     */
    async debitarCliente(clienteId: number, monto: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void> { 
        console.log(`🟡 [WALLET SERVICE - DEBITAR] Cobrando $${monto} al Cliente ID: ${clienteId} hacia la Empresa`);
        
        const empresaId = await this.getEmpresaUsuarioId(); // Obtiene ID 19 desde configuración
        const walletCliente = await this.getWallet(clienteId, tx); 
        const walletEmpresa = await this.getWallet(empresaId, tx);

        // 1. Debitar de la wallet del Cliente
        const saldoAnteriorCliente = walletCliente.saldoDisponible;
        walletCliente.debitar(monto);
        await this.walletRepository.updateWithMovement(
            walletCliente, 
            "PAGO_TRASLADO", 
            monto,
            saldoAnteriorCliente, 
            trasladoId, 
            `Pago por traslado #${trasladoId}`,
            tx
        );

        // 2. Acreditar en la wallet de la Empresa (Retención inicial del 100%)
        const saldoAnteriorEmpresa = walletEmpresa.saldoDisponible;
        walletEmpresa.acreditar(monto);
        await this.walletRepository.updateWithMovement(
            walletEmpresa, 
            "PAGO_TRASLADO", 
            monto,
            saldoAnteriorEmpresa, 
            trasladoId, 
            `Ingreso en custodia por traslado #${trasladoId}`,
            tx
        );

        console.log(`🟢 [WALLET SERVICE - DEBITAR] Custodia registrada en Empresa ID: ${empresaId}`);
    }

    /**
     * RN-014 / RN-015: Al finalizar, la empresa LIBERA la parte
     * del chofer. El dinero SALE de la Empresa y ENTRA al Chofer.
     * (El porcentaje restante se queda como ganancia neta en la Empresa).
     */
    async creditarChofer(choferId: number, montoChofer: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void> {
        console.log(`🟡 [WALLET SERVICE - CREDITAR] Liberando pago de $${montoChofer} al Chofer ID: ${choferId} desde la Empresa`);
        
        const empresaId = await this.getEmpresaUsuarioId(); // Obtiene ID 19
        const walletEmpresa = await this.getWallet(empresaId, tx);
        const walletChofer = await this.getWallet(choferId, tx);

        // 1. Debitar de la Empresa (Sale el pago del chofer, la comisión se queda en el saldo)
        const saldoAnteriorEmpresa = walletEmpresa.saldoDisponible;
        walletEmpresa.debitar(montoChofer);
        await this.walletRepository.updateWithMovement(
            walletEmpresa, 
            "PAGO_TRASLADO", 
            montoChofer,
            saldoAnteriorEmpresa, 
            trasladoId, 
            `Pago liberado a chofer por traslado #${trasladoId}`,
            tx
        );

        // 2. Acreditar en la wallet del Chofer
        const saldoAnteriorChofer = walletChofer.saldoDisponible;
        walletChofer.acreditar(montoChofer);
        await this.walletRepository.updateWithMovement(
            walletChofer, 
            "PAGO_TRASLADO", 
            montoChofer,
            saldoAnteriorChofer, 
            trasladoId, 
            `Pago recibido por completar traslado #${trasladoId}`,
            tx
        );

        console.log(`🟢 [WALLET SERVICE - CREDITAR] Pago transferido al chofer exitosamente.`);
    }

    /**
     * Cancelación antes de EN_CURSO: nadie pagó nada aún,
     * se descuenta la penalización fija directo de quien canceló.
     */

    async aplicarPenalizacion(usuarioId: number, monto: number, trasladoId: number, motivo: string, tx? : Prisma.TransactionClient): Promise<void> {
        
        const wallet = await this.walletRepository.findByUsuarioId(usuarioId, tx); 
        if(!wallet) throw new Error(`Wallet not found for usuario ${usuarioId}`); 


        const saldoAnterior = wallet.saldoDisponible; 
        wallet.debitarPenalizacion(monto); 

        await this.walletRepository.updateWithMovement(
            wallet, "PENALIZACION" , monto,
            saldoAnterior, trasladoId, motivo,
            tx
        ); 


    }


    /**
     * Cancelación durante EN_CURSO: el cliente ya pagó a la
     * wallet Empresa. Se le reembolsa el costo menos la
     * penalización; la empresa retiene la penalización.
     */

    async reembolsarConPenalizacion(
        clienteId: number, montoTotal: number, penalizacion: number, trasladoId: number, tx?: Prisma.TransactionClient
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
            `Reembolso parcial traslado #${trasladoId} (penalización retenida: ${penalizacion})`,
            tx
        );

        const saldoAnteriorCliente = walletCliente.saldoDisponible; 

        walletCliente.acreditar(montoReembolso);
        await this.walletRepository.updateWithMovement(
            walletCliente, "REVERSO", montoReembolso,
            saldoAnteriorCliente, trasladoId,
            `Reembolso por cancelación de traslado #${trasladoId}`,
            tx
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


    /**
     * RN-Retiros: Al solicitar retiro, el dinero pasa de saldo_disponible
     * a saldo_congelado y se genera la solicitud en PENDIENTE.
     */
    async congelarParaRetiro(
        usuarioId: number, 
        monto: number, 
        bancoId: number,
        numeroCuenta: string,
        titularCuenta: string,
        solicitudRepo: any,
        tx?: Prisma.TransactionClient
    ): Promise<any> {
        console.log(`🟡 [WALLET SERVICE - RETIRO] Congelando $${monto} para Usuario ID: ${usuarioId}`);
        
        const wallet = await this.getWallet(usuarioId, tx);
        
        if (Number(wallet.saldoDisponible) < monto) {
            throw new Error(`Saldo insuficiente para solicitar el retiro. Disponible: $${wallet.saldoDisponible}`);
        }

        if (monto <= 0) {
            throw new Error("El monto a retirar debe ser mayor a cero.");
        }

        // 1. Restamos del disponible y sumamos al congelado
        wallet.debitar(monto);
        if (typeof wallet.congelar === 'function') {
            wallet.congelar(monto);
        } else {
            wallet.saldoCongelado = Number(wallet.saldoCongelado) + Number(monto);
        }

        // 2. Persistimos los saldos en BD
        const client = tx ?? prisma;
        await client.wallet.update({
            where: { id_wallet: wallet.id },
            data: {
                saldo_disponible: wallet.saldoDisponible,
                saldo_congelado: wallet.saldoCongelado
            }
        });

        // 3. Creamos el registro en solicitud_retiro
        const nuevaSolicitud = await solicitudRepo.create({
            walletId: wallet.id,
            bancoId: bancoId,
            monto: monto,
            numeroCuenta: numeroCuenta,
            titularCuenta: titularCuenta,
            estado: "PENDIENTE"
        }, tx);

        console.log(`🟢 [WALLET SERVICE - RETIRO] Fondos congelados y solicitud #${nuevaSolicitud.id_retiro} creada.`);
        return nuevaSolicitud;
    }

    /**
     * RN-Retiros: Al APROBAR un retiro, el dinero sale definitivamente
     * del saldo_congelado y se genera el movimiento de auditoría "RETIRO".
     */
    /**
     * RN-Retiros: Al APROBAR un retiro, el dinero sale definitivamente
     * del saldo_congelado y se genera el movimiento de auditoría "RETIRO".
     */
    async aprobarRetiro(solicitudId: number, solicitudRepo: any, tx?: Prisma.TransactionClient): Promise<any> {
        console.log(`🟡 [WALLET SERVICE - RETIRO] Aprobando solicitud #${solicitudId}...`);
        const client = tx ?? prisma;

        // 1. Obtener y validar la solicitud
        const solicitud = await solicitudRepo.findById(solicitudId, tx);
        if (!solicitud) throw new Error(`Solicitud #${solicitudId} no encontrada.`);
        if (solicitud.estado !== "PENDIENTE") throw new Error(`La solicitud #${solicitudId} no está en estado PENDIENTE.`);

        // 2. Obtener la wallet
        const wallet = await this.walletRepository.findById(solicitud.id_wallet, tx);
        if (!wallet) throw new Error(`Wallet #${solicitud.id_wallet} no encontrada.`);

        const monto = Number(solicitud.monto);

        // 3. Descontar del saldo congelado (liberar la retención)
        if (typeof wallet.descongelar === 'function') {
            wallet.descongelar(monto);
        } else {
            wallet.saldoCongelado = Number(wallet.saldoCongelado) - monto;
        }

        // 4. Actualizar el saldo congelado en BD (Baja a $0.00)
        await client.wallet.update({
            where: { id_wallet: wallet.id },
            data: { saldo_congelado: wallet.saldoCongelado }
        });

        // 5. Cálculo contable para la auditoría de movimiento_wallet:
        // Como el saldo disponible bajó cuando el chofer solicitó el retiro,
        // para el historial el saldo_anterior era (saldoDisponible + monto)
        const saldoPosterior = Number(wallet.saldoDisponible);
        const saldoAnterior = saldoPosterior + monto;

        await client.movimiento_wallet.create({
            data: {
                id_wallet: wallet.id,
                id_traslado: null,
                tipo_movimiento: "RETIRO",
                monto: monto,
                saldo_anterior: saldoAnterior,
                saldo_posterior: saldoPosterior,
                descripcion: `Retiro bancario procesado (Cuenta: ${solicitud.numero_cuenta})`
            }
        });

        // 6. Cambiar estado a APROBADA (en femenino como lo exige tu BD)
        const solicitudAprobada = await solicitudRepo.updateEstado(solicitudId, "APROBADA", tx);
        console.log(`🟢 [WALLET SERVICE - RETIRO] Retiro #${solicitudId} aprobado exitosamente.`);
        return solicitudAprobada;
    }

    /**
     * RN-Retiros: Al RECHAZAR un retiro, el dinero sale de saldo_congelado
     * y regresa al saldo_disponible del chofer.
     */
    async rechazarRetiro(solicitudId: number, solicitudRepo: any, tx?: Prisma.TransactionClient): Promise<any> {
        console.log(`🟡 [WALLET SERVICE - RETIRO] Rechazando solicitud #${solicitudId}...`);
        const client = tx ?? prisma;

        const solicitud = await solicitudRepo.findById(solicitudId, tx);
        if (!solicitud || solicitud.estado !== "PENDIENTE") throw new Error("Solicitud inválida o ya procesada.");

        const wallet = await this.walletRepository.findById(solicitud.id_wallet, tx);
        if (!wallet) throw new Error("Wallet no encontrada.");

        // Reembolsamos al disponible: quitamos de congelado y sumamos a disponible
        const monto = Number(solicitud.monto);
        wallet.acreditar(monto);
        if (typeof wallet.descongelar === 'function') {
            wallet.descongelar(monto);
        } else {
            wallet.saldoCongelado = Number(wallet.saldoCongelado) - monto;
        }

        await client.wallet.update({
            where: { id_wallet: wallet.id },
            data: {
                saldo_disponible: wallet.saldoDisponible,
                saldo_congelado: wallet.saldoCongelado
            }
        });

        return await solicitudRepo.updateEstado(solicitudId, "RECHAZADA", tx);
    }
}