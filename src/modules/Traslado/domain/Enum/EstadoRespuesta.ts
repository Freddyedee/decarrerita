// domain/EstadoRespuesta.ts

/**
 * Estado de la respuesta de un chofer candidato
 * ante una oferta de traslado.
 */
export enum EstadoRespuesta {
    PENDIENTE = 'PENDIENTE',
    ACEPTADO  = 'ACEPTADO',
    RECHAZADO = 'RECHAZADO'
}