// application/use-cases/SetConfiguracionUseCase.ts

import { SetConfiguracionDTO } from "../dto/create-configuracion-dto";
import { IConfiguracionRepository } from "../../domain/repositories/IConfiguracionRepository";

export class SetConfiguracionUseCase {

    constructor(private readonly configRepository: IConfiguracionRepository) {}

    async execute(input: SetConfiguracionDTO): Promise<void> {
        if (!input.nombre || !input.valor) {
            throw new Error("nombre and valor are required");
        }
        await this.configRepository.setValor(input.nombre, input.valor, input.descripcion);
    }
}