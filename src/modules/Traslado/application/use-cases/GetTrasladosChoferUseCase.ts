import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";

export class GetTrasladosChoferUseCase {
    
    constructor(
        private readonly trasladoRepository: ITrasladoRepository
    ) {}

    async execute(choferId: number, estados: string[], desde: Date, hasta: Date) {
        
        // Regla de negocio: Validar coherencia en el rango de fechas
        if (desde > hasta) {
            throw new Error("La fecha de inicio (desde) no puede ser mayor a la fecha final (hasta).");
        }

        // Llamada al método de solo lectura que acabamos de crear en el repositorio
        const traslados = await this.trasladoRepository.getTrasladosPorChoferYEstado(
            choferId, 
            estados, 
            desde, 
            hasta
        );

        return traslados;
    }
}