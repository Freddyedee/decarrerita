import { IniciarTrasladoDTO } from "../dto/IniciarTrasladoDto";

import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";

import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";

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

        private readonly historialRepository: IHistorialTrasladoRepository

    ) {}

    async execute(input: IniciarTrasladoDTO) {

        /**
         * ===================================================
         * 1. Buscar traslado
         * ===================================================
         */

        const traslado =

            await this.trasladoRepository.findById(

                input.trasladoId

            );

        if (!traslado) {

            throw new Error(

                `Traslado ${input.trasladoId} not found`

            );

        }

        /**
         * ===================================================
         * 2. Guardar estado anterior
         * ===================================================
         *
         * Se utiliza para registrar auditoría.
         */

        const estadoAnterior = traslado.estadoActual;

        /**
         * ===================================================
         * 3. Cambiar estado
         * ===================================================
         *
         * La Entity valida automáticamente
         * que únicamente un traslado ASIGNADO
         * pueda iniciar.
         */

        traslado.iniciar();

        /**
         * ===================================================
         * 4. Persistir cambios
         * ===================================================
         */

        const updatedTraslado =

            await this.trasladoRepository.update(

                traslado

            );

        /**
         * ===================================================
         * 5. Registrar auditoría
         * ===================================================
         */

        await this.historialRepository.registrarCambio(

            updatedTraslado.id,

            estadoAnterior,

            EstadoTraslado.EN_CURSO,

            "Trip started"

        );

        /**
         * ===================================================
         * 6. Resultado
         * ===================================================
         */

        return updatedTraslado;

    }

}