import { CreateRevisionDTO } from "../application/dto/create-revision";
import { RegisterVehicleInspectionsUseCase } from "../application/use-cases/RegisterVehicleInspectionUseCase";
import { GetInspectionHistoryUseCase } from "../application/use-cases/GetInspectionHistoryUseCase";

export class RevisionController { 

    constructor (
        private readonly registerVehicleInspectionsUseCase: RegisterVehicleInspectionsUseCase, 
        private readonly getInspectionHistoryUseCase: GetInspectionHistoryUseCase
    ){}

    async register(body: CreateRevisionDTO){ 
        return this.registerVehicleInspectionsUseCase.execute(body)
    }

    async getHistory(vehicleId: number){
        return this.getInspectionHistoryUseCase.execute(vehicleId); 
    }


}