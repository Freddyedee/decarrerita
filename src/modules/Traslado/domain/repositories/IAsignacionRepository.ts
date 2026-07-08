// domain/repositories/IAsignacionRepository.ts

import { AsignacionChofer } from "../entities/AsignacionChofer";

export interface IAsignacionRepository {

    /**
     * Crea la cola completa de ofertas para un traslado,
     * ya ordenada por prioridad.
     */
    createBatch(asignaciones: AsignacionChofer[]): Promise<AsignacionChofer[]>;

    findByTrasladoId(trasladoId: number): Promise<AsignacionChofer[]>;

    update(asignacion: AsignacionChofer): Promise<AsignacionChofer>;

    /**
     * Siguiente candidato pendiente en la cola,
     * el de mayor prioridad que aún no ha respondido.
     */
    findSiguientePendiente(trasladoId: number): Promise<AsignacionChofer | null>;
}