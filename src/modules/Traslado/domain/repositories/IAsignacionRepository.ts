import { AsignacionChofer } from "../entities/AsignacionChofer";

export interface IAsignacionRepository {

    createBatch(asignaciones: AsignacionChofer[]): Promise<AsignacionChofer[]>;

    findById(id: number): Promise<AsignacionChofer | null>;

    findByTrasladoId(trasladoId: number): Promise<AsignacionChofer[]>;

    update(asignacion: AsignacionChofer): Promise<AsignacionChofer>;

    findSiguientePendiente(
        trasladoId: number
    ): Promise<AsignacionChofer | null>;

    /**
     * Intenta aceptar una oferta únicamente
     * si todavía permanece pendiente.
     *
     * Esta operación debe ser atómica
     * (evita que dos choferes acepten
     * simultáneamente).
     */
    aceptarSiSigueDisponible(
        asignacionId: number
    ): Promise<boolean>;

    /**
     * Cuando un chofer gana el viaje,
     * todas las demás ofertas pendientes
     * deben cerrarse automáticamente.
     */
    cerrarOfertasRestantes(
        trasladoId: number,
        asignacionGanadoraId: number
    ): Promise<void>;

}