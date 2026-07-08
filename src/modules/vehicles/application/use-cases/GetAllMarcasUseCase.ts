// application/use-cases/GetAllMarcasUseCase.ts

import { Marca } from "../../domain/entities/Marca";
import { IMarcaRepository } from "../../domain/repositories/IMarcaRepository";

export class GetAllMarcasUseCase {

    constructor(
        private readonly marcaRepository: IMarcaRepository
    ) {}

    async execute(): Promise<Marca[]> {
        return this.marcaRepository.findAll();
    }
}