import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";

export class GetAllTrasladosUseCase {
    constructor(private readonly trasladoRepository: ITrasladoRepository) {}

    async execute(): Promise<any[]> {
        return await this.trasladoRepository.findAllWithDetails();
    }
}