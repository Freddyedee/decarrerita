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
        private readonly historialRepository: IHistorialTrasladoRepository,
        private readonly walletService: IWalletService

    ) {}

       /**
    * Procesa la respuesta de un conductor a una oferta de traslado.
    * * - Si rechaza: Actualiza el estado, registra el historial y verifica si hay otros candidatos.
    * Si no quedan candidatos, marca el traslado como 'SIN_CHOFER'.
    * - Si acepta: Asegura la atomicidad de la asignación (RN-019), marca el traslado como
    * 'ASIGNADO', cierra las ofertas restantes y registra el historial.
    * * @param input - DTO con el ID de la asignación y la respuesta (ACEPTADO/RECHAZADO).
    * @throws Error si la asignación no existe o si la oferta ya no está disponible.
    */
    async execute(input: ResponderAsignacionDTO) {

        //1. Validación de entrada: Evitamos procesar estados invalidos desde la llamada al metodo. 
        if (input.respuesta === EstadoRespuesta.PENDIENTE) {
            throw new Error("PENDING is not a valid response.");
        }

        //2. Recuperacion de datos: Aseguramos que los agregados necesarios existan antes de actuar 
        const asignacion = await this.asignacionRepository.findById(input.asignacionId);
        if (!asignacion) {
            throw new Error(`Assignment ${input.asignacionId} not found`);
        }

        const traslado = await this.trasladoRepository.findById(asignacion.trasladoId);
        if (!traslado) {
            throw new Error(`Traslado ${asignacion.trasladoId} not found`);
        }

        // 3. ---------------- RECHAZO ----------------
        if (input.respuesta === EstadoRespuesta.RECHAZADO) {
            
            //A. Marco de rechazo en dominio y persistencia
            asignacion.rechazar();
            await this.asignacionRepository.update(asignacion);
            
            //B. auditoria del rechazo
            await this.historialRepository.registrarCambio(
                traslado.id,
                traslado.estadoActual,
                traslado.estadoActual,
                `Driver ${asignacion.choferId} rejected assignment`
            );

            //C. Gestión de candidatos: Busca si hay alguien más disponible 
            const siguiente = await this.asignacionRepository.findSiguientePendiente(traslado.id);

            
            // D. Estado terminal de busqueda: Si no hay nadie más, el traslado se marca como SIN_CHOFER
            if (!siguiente) {
                traslado.marcarSinChofer();
                await this.trasladoRepository.update(traslado);

                await this.historialRepository.registrarCambio(
                    traslado.id,
                    EstadoTraslado.BUSCANDO_CHOFER,
                    EstadoTraslado.SIN_CHOFER,
                    "All candidates rejected the offer"
                );
            }

            return { traslado, asignacion, siguienteChofer: siguiente };
        }

        // ---------------- ACEPTACIÓN ----------------

        //4.logica de aceptación Atomica
        //Se verifica la dispinibilidad antes de proceder para evitar condiciones de carrrera (Race Conditions)
        const accepted = await this.asignacionRepository.aceptarSiSigueDisponible(asignacion.id);

        if (!accepted) {
            throw new Error("Assignment is no longer available.");
        }

        //5. Consolidación del traslado
        asignacion.aceptar();

        //Se invoca el método de dominio (Regla de negocio RN-019)
        traslado.asignarChofer(asignacion.choferId, asignacion.vehiculoId);
        
        //6.Persistencia y cierre 
        await this.asignacionRepository.update(asignacion);
        await this.trasladoRepository.update(traslado);

        //7. Se limpian las ofertas que no son necesarias
        await this.asignacionRepository.cerrarOfertasRestantes(traslado.id, asignacion.id);

        //7. Auditoria final y respuesta
        await this.historialRepository.registrarCambio(
            traslado.id,
            EstadoTraslado.BUSCANDO_CHOFER,
            EstadoTraslado.ASIGNADO,
            `Driver ${asignacion.choferId} accepted assignment`
        );

        return { traslado, asignacion };
    }
}
