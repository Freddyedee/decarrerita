import { Banco } from "../entities/Banco";

export interface IBancoRepository {

    findAllActive(): Promise<Banco[]>;

    findById(id: number): Promise<Banco | null>;

}