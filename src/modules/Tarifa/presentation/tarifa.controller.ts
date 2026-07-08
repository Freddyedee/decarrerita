import { CreateTarifaDTO } from "../aplication/dto/create-tarifa-dto";
import { CreateTarifaUseCase } from "../aplication/use-cases/CreateTarifaUseCase";
import { GetTarifaVigenteUseCase } from "../aplication/use-cases/GetTarifaVigenteUseCase";

export class TarifaController {

constructor (private readonly createTarifaUseCase: CreateTarifaUseCase, private readonly getTarifaVigenteUseCase: GetTarifaVigenteUseCase){}

    async create(body: CreateTarifaDTO){
        return this.createTarifaUseCase.execute(body); 
    }


    async getVigente(){
        return this.getTarifaVigenteUseCase.execute(); 
    }
}