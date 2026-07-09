/**
 * ============================================================
 * IniciarTrasladoDTO
 * ============================================================
 *
 * Información mínima necesaria para iniciar un traslado.
 *
 * Este DTO representa el momento en que el chofer ya llegó
 * al punto de origen y comienza oficialmente el viaje.
 *
 * El resto de la información (cliente, chofer, vehículo,
 * tarifa, costo, etc.) ya existe en la base de datos y
 * será recuperada por el UseCase.
 *
 * ============================================================
 */

export interface IniciarTrasladoDTO {

    /**
     * Identificador del traslado que se desea iniciar.
     */
    trasladoId: number;

}