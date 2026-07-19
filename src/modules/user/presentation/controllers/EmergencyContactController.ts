import { RegisterEmergencyContactUseCase } from "../../application/use-cases/RegisterEmergencyContactUseCase";
import { GetEmergencyContactsUseCase } from "../../application/use-cases/GetEmergencyContactsUseCase";

import { RegisterEmergencyContactRequest } from "../../application/dto/RegisterEmergencyContactRequest";
import { EmergencyContactResponse } from "../../application/dto/EmergencyContactResponse";

export class EmergencyContactController {

    constructor(

        private readonly registerEmergencyContactUseCase: RegisterEmergencyContactUseCase,

        private readonly getEmergencyContactsUseCase: GetEmergencyContactsUseCase

    ) {}

    async register(
        request: RegisterEmergencyContactRequest
    ): Promise<EmergencyContactResponse> {

        return this.registerEmergencyContactUseCase.execute(request);

    }

    async getByDriver(
        driverUserId: number
    ): Promise<EmergencyContactResponse[]> {

        return this.getEmergencyContactsUseCase.execute(driverUserId);

    }

}