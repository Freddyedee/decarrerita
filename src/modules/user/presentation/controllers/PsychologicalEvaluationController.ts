import { RegisterPsychologicalEvaluationUseCase } from "../../application/use-cases/RegisterPsychologicalEvaluationUseCase";
import { GetPsychologicalEvaluationsUseCase } from "../../application/use-cases/GetPsychologicalEvaluationsUseCase";

import { RegisterPsychologicalEvaluationRequest } from "../../application/dto/RegisterPsychologicalEvaluationRequest";
import { PsychologicalEvaluationResponse } from "../../application/dto/PsychologicalEvaluationResponse";

export class PsychologicalEvaluationController {

    constructor(

        private readonly registerPsychologicalEvaluationUseCase: RegisterPsychologicalEvaluationUseCase,

        private readonly getPsychologicalEvaluationsUseCase: GetPsychologicalEvaluationsUseCase

    ) {}

    async register(
        request: RegisterPsychologicalEvaluationRequest
    ): Promise<PsychologicalEvaluationResponse> {

        return await this.registerPsychologicalEvaluationUseCase.execute(request);

    }

    async getByDriver(
        driverUserId: number
    ): Promise<PsychologicalEvaluationResponse[]> {

        return await this.getPsychologicalEvaluationsUseCase.execute(driverUserId);

    }

}