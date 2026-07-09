import { EstadoRespuesta } from "../../domain/Enum/EstadoRespuesta";

/**
 * ============================================================
 * ResponderAsignacionDTO
 * ============================================================
 *
 * Información mínima necesaria para que un chofer responda
 * una oferta de traslado.
 *
 * El UseCase recuperará el resto de la información
 * (traslado, chofer, prioridad, etc.) desde los repositorios.
 *
 * ============================================================
 */

export interface ResponderAsignacionDTO {

    /**
     * Identificador único de la oferta (AsignacionChofer)
     * que está siendo respondida.
     */
    asignacionId: number;

    /**
     * Respuesta enviada por el chofer.
     *
     * Valores permitidos:
     *
     * - PENDIENTE (no debería enviarse desde el cliente)
     * - ACEPTADO
     * - RECHAZADO
     *
     * El UseCase procesará únicamente
     * ACEPTADO o RECHAZADO.
     */
    respuesta: EstadoRespuesta;

}