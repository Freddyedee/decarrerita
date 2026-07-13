import { TarifaRepository } from "../infrastructure/prisma/tarifa.repository";
import { CreateTarifaUseCase } from "../aplication/use-cases/CreateTarifaUseCase";
import { GetTarifaVigenteUseCase } from "../aplication/use-cases/GetTarifaVigenteUseCase";
import { TarifaController } from "./tarifa.controller";


const tarifaRepository = new TarifaRepository(); 

const createTarifaUseCase = new CreateTarifaUseCase(tarifaRepository); 

const getTarifaVigenteUseCase = new GetTarifaVigenteUseCase(tarifaRepository); 

export const tarifaController = new TarifaController(createTarifaUseCase, getTarifaVigenteUseCase); 



export { tarifaRepository}