// application/use-cases/GetInspectionHistoryUseCase.ts

import { RevisionVehicular } from "../../domain/entities/RevisionVehicular"; 
import { IRevisionRepository } from "../../domain/repositories/IRevisionVehicular";

export class GetInspectionHistoryUseCase {

    constructor(
        private readonly revisionRepository: IRevisionRepository
    ) {}

    async execute(vehicleId: number): Promise<RevisionVehicular[]> {
        return this.revisionRepository.findByVehicleId(vehicleId);
    }
}