import { SetConfiguracionDTO } from "../application/dto/create-configuracion-dto";
import { SetConfiguracionUseCase } from "../application/use-cases/SetConfiguracionUseCase";
import { IConfiguracionRepository } from "../domain/repositories/IConfiguracionRepository";

export class ConfiguracionController {
    constructor (private readonly setConfiguracionUseCase: SetConfiguracionUseCase, private readonly configRepository: IConfiguracionRepository){}

    async set(body: SetConfiguracionDTO){
        await this.setConfiguracionUseCase.execute(body); 
        return {
            nombre: body.nombre, valor : body.valor
        }; 
    }

    async getAll(){
        return this.configRepository.findAll();
    }
}