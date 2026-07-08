// domain/repositories/ITarifaRepository.ts

import { Tarifa } from "../entities/Tarifa";


export interface ITarifaRepository {
    create(tarifa: Tarifa): Promise<Tarifa>;
    findVigente(referenceDate?: Date): Promise<Tarifa | null>;
    findAll(): Promise<Tarifa[]>;
    closeVigencia(id: number, fechaFin: Date): Promise<void>;
}