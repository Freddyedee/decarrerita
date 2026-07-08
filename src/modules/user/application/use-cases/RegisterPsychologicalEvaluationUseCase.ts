import { PsychologicalEvaluation } from "../../domain/entitites/PsychologicalEvaluation";
import { PsychologicalEvaluationResponse } from "../dto/PsychologicalEvaluationResponse";
import { RegisterPsychologicalEvaluationRequest } from "../dto/RegisterPsychologicalEvaluationRequest";
import { IDriverRepository } from "../ports/IDriverRepository";
import { IPsychologicalEvaluationRepository } from "../ports/IPsychologicalEvaluationRepository";

export class RegisterPsychologicalEvaluationUseCase {

    constructor(

        private readonly driverRepository: IDriverRepository,

        private readonly evaluationRepository: IPsychologicalEvaluationRepository

    ) {}

    async execute(

        request: RegisterPsychologicalEvaluationRequest

    ): Promise<PsychologicalEvaluationResponse> {

        const driver = await this.driverRepository.findByUserId(
            request.driverUserId
        );

        if (!driver) {
            throw new Error("Driver not found.");
        }

        const evaluation = new PsychologicalEvaluation(

            null,

            request.driverUserId,

            new Date(),

            request.result,

            request.observations,

            request.expirationDate,

            request.score

        );

        const savedEvaluation =
            await this.evaluationRepository.save(evaluation);

        if (savedEvaluation.getEvaluationId() === null) {
            throw new Error("Evaluation id was not generated.");
        }

        return {

            evaluationId: savedEvaluation.getEvaluationId()!,

            driverUserId: savedEvaluation.getDriverUserId(),

            evaluationDate: savedEvaluation.getEvaluationDate(),

            result: savedEvaluation.getResult(),

            observations: savedEvaluation.getObservations(),

            expirationDate: savedEvaluation.getExpirationDate(),

            score: savedEvaluation.getScore()

        };

    }

}