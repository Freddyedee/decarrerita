import { Tarifa } from "../../domain/entities/Tarifa";
import { ITarifaRepository } from "../../domain/repositories/ITarifaRepository";

export class GetTarifaVigenteUseCase {

    constructor(private readonly tarifaRepository: ITarifaRepository) {}

    async execute(): Promise<Tarifa> {
        const tarifa = await this.tarifaRepository.findVigente();
        if (!tarifa) throw new Error("No active tarifa found");
        return tarifa;
    }
}