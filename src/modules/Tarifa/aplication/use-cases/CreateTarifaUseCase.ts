// application/use-cases/CreateTarifaUseCase.ts

import { CreateTarifaDTO } from "../dto/create-tarifa-dto";
import { Tarifa } from "../../domain/entities/Tarifa";
import { ITarifaRepository } from "../../domain/repositories/ITarifaRepository";

export class CreateTarifaUseCase {

    constructor(private readonly tarifaRepository: ITarifaRepository) {}

    async execute(input: CreateTarifaDTO): Promise<Tarifa> {

        if (input.precioKm <= 0 || input.tarifaBase <= 0) {
            throw new Error("precioKm and tarifaBase must be positive");
        }

        if (input.porcentajeComision < 0 || input.porcentajeComision > 100) {
            throw new Error("porcentajeComision must be between 0 and 100");
        }

        const now = new Date();

        // Solo una tarifa vigente a la vez: cerramos la anterior.
        const previous = await this.tarifaRepository.findVigente(now);
        if (previous) {
            await this.tarifaRepository.closeVigencia(previous.id, now);
        }

        const tarifa = new Tarifa(
            0,
            input.precioKm,
            input.tarifaBase,
            input.tarifaCancelacion,
            input.porcentajeComision,
            now,
            null
        );

        return this.tarifaRepository.create(tarifa);
    }
}