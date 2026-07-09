import { EstadoRespuesta } from "../../domain/Enum/EstadoRespuesta";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";

import { IAsignacionRepository } from "../../domain/repositories/IAsignacionRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";
import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";

import { ResponderAsignacionDTO } from "../dto/ResponderAsignacionDto";

/**
 * ============================================================
 * ResponderAsignacionUseCase
 * ============================================================
 *
 * Caso de uso responsable de procesar la respuesta de un chofer
 * frente a una oferta de traslado.
 *
 * Este caso NO:
 *
 * - inicia el viaje
 * - cobra dinero
 * - paga al chofer
 * - envía notificaciones
 *
 * Su única responsabilidad es resolver correctamente
 * la asignación del viaje.
 *
 * ============================================================
 */

export class ResponderAsignacionUseCase {

    constructor(

        private readonly trasladoRepository: ITrasladoRepository,

        private readonly asignacionRepository: IAsignacionRepository,

        private readonly historialRepository: IHistorialTrasladoRepository

    ) {}

    async execute(input: ResponderAsignacionDTO) {

        if (input.respuesta === EstadoRespuesta.PENDIENTE) {
        throw new Error(
          "PENDING is not a valid response."
        );  
}


        // * 1. Buscar la asignación
       

        const asignacion =
            await this.asignacionRepository.findById(input.asignacionId);

        if (!asignacion) {

            throw new Error(
                `Assignment ${input.asignacionId} not found`
            );

        }

         //* 2. Buscar traslado asociado
      

        const traslado =
            await this.trasladoRepository.findById(
                asignacion.trasladoId
            );

        if (!traslado) {

            throw new Error(
                `Traslado ${asignacion.trasladoId} not found`
            );

        }


         //* 3. Procesar rechazo
       

        if (input.respuesta === EstadoRespuesta.RECHAZADO) {

            asignacion.rechazar();

            await this.asignacionRepository.update(asignacion);

            await this.historialRepository.registrarCambio(

                traslado.id,

                traslado.estadoActual,

                traslado.estadoActual,

                `Driver ${asignacion.choferId} rejected assignment`

            );

            /**
             * Aquí únicamente verificamos si existe
             * otro candidato pendiente.
             *
             * La futura notificación se realizará
             * mediante otro servicio.
             */

            const siguiente =

                await this.asignacionRepository
                    .findSiguientePendiente(traslado.id);

            return {

                traslado,

                asignacion,

                siguienteChofer: siguiente

            };

        }


        /** 4. Procesar aceptación
         * ----------------------------------------------------
         *
         * Esta operación debe ser atómica.
         *
         * Dos choferes podrían aceptar al mismo
         * tiempo.
         *
         * El Repository garantiza que únicamente
         * uno gane.
         */

        const accepted =

            await this.asignacionRepository.aceptarSiSigueDisponible(asignacion.id);

        if (!accepted) {
            throw new Error(
                "Assignment is no longer available."
            );
        }

        /**
         * Actualizamos la entidad del dominio.
         */

        asignacion.aceptar();

        /**
         * El traslado deja de buscar chofer.
         */

        traslado.asignarChofer(asignacion.choferId, asignacion.vehiculoId); 

        /**
         * Persistimos ambos cambios.
         */

        await this.asignacionRepository.update(asignacion);

        await this.trasladoRepository.update(traslado);

        /**
         * Cerramos automáticamente
         * todas las demás ofertas.
         */

        await this.asignacionRepository
            .cerrarOfertasRestantes(

                traslado.id,

                asignacion.id

            );

        /**
         * Auditoría.
         */

        await this.historialRepository.registrarCambio(

            traslado.id,

            EstadoTraslado.BUSCANDO_CHOFER,

            EstadoTraslado.ASIGNADO,

            `Driver ${asignacion.choferId} accepted assignment`

        );

        /**
         * Resultado final.
         */

        return {traslado,asignacion};

    }

}