/**
 * Estados posibles del ciclo de vida de un traslado.
 *
 * Nota importante: "cancelado" aquí significa que el VIAJE
 * se anuló antes de completarse (por cliente o chofer, con
 * penalización). Esto es distinto del "cancelar" que usa el
 * personal administrativo para referirse al PAGO al chofer
 * — ese concepto vive en movimiento_wallet, no aquí.
 */
export enum EstadoTraslado {
    SOLICITADO = 'SOLICITADO',   // creado, buscando chofer
    EN_CURSO   = 'EN_CURSO',     // chofer aceptó, viaje en marcha
    COMPLETADO = 'COMPLETADO',   // llegó a destino
    CANCELADO  = 'CANCELADO'     // anulado antes de completar, con penalización
}