import { CalificarTrasladoDTO } from "../application/DTO/CalificarTrasladoDTO";
import { CalificarTrasladoUseCase } from "../application/use-cases/CalificarTrasladoUseCase";

export class CalificacionController { 

    constructor (private readonly calificarTrasladoUseCase: CalificarTrasladoUseCase){}

    async calificar (body: CalificarTrasladoDTO){ 
        return  this.calificarTrasladoUseCase.execute(body); 
    }
}