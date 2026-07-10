import { IniciarTrasladoDTO } from "../dto/IniciarTrasladoDto";

import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";

import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";
import { IWalletService } from "@/modules/wallet/domain/ports/IWalletServices";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";

/**
 * ============================================================
 * IniciarTrasladoUseCase
 * ============================================================
 *
 * Marca el comienzo oficial del viaje.
 *
 * El traslado pasa de:
 *
 *      ASIGNADO
 *          ↓
 *      EN_CURSO
 *
 * Este caso de uso NO:
 *
 * - cobra dinero
 * - genera movimientos wallet
 * - finaliza el viaje
 * - envía notificaciones
 *
 * ============================================================
 */

export class IniciarTrasladoUseCase {

    constructor(
        private readonly trasladoRepository: ITrasladoRepository,
        private readonly historialRepository: IHistorialTrasladoRepository,
        private readonly walletService: IWalletService,
        private readonly transactionManager: ITransactionManager
    ) {}

    async execute(input: IniciarTrasladoDTO) {

        const traslado = await this.trasladoRepository.findById(input.trasladoId);
        if (!traslado) {
            throw new Error(`Traslado ${input.trasladoId} not found`);
        }

        const estadoAnterior = traslado.estadoActual;

        traslado.iniciar(); // valida el estado en memoria, no toca la BD todavía

        // Todo lo que ocurre dentro de este callback vive en
        // UNA sola transacción: o se aplica completo, o no se
        // aplica nada. Si walletService.debitarCliente lanza un
        // error (saldo insuficiente, fallo de conexión, etc.),
        // Prisma revierte automáticamente el update del traslado
        // también — nunca quedan desincronizados.
        const updatedTraslado = await this.transactionManager.run(async (tx) => {

            await this.walletService.debitarCliente(
                traslado.clienteId,
                traslado.costoEstimado,
                traslado.id,
                tx
            );

            return this.trasladoRepository.update(traslado, tx);
        });

        // El historial se registra DESPUÉS de que la transacción
        // ya confirmó exitosamente — si llegamos aquí, todo lo
        // anterior se aplicó de verdad.
        await this.historialRepository.registrarCambio(
            updatedTraslado.id,
            estadoAnterior,
            EstadoTraslado.EN_CURSO,
            "Trip started, client charged"
        );

        return updatedTraslado;
    }
}