import { PsychologicalEvaluationResponse } from "../dto/PsychologicalEvaluationResponse";
import { IPsychologicalEvaluationRepository } from "../ports/IPsychologicalEvaluationRepository";

export class GetPsychologicalEvaluationsUseCase {

    constructor(

        private readonly evaluationRepository: IPsychologicalEvaluationRepository

    ) {}

    async execute(

        driverUserId: number

    ): Promise<PsychologicalEvaluationResponse[]> {

        const evaluations =
            await this.evaluationRepository.findByDriverUserId(
                driverUserId
            );

        return evaluations.map(evaluation => ({

            evaluationId: evaluation.getEvaluationId()!,

            driverUserId: evaluation.getDriverUserId(),

            evaluationDate: evaluation.getEvaluationDate(),

            result: evaluation.getResult(),

            observations: evaluation.getObservations(),

            expirationDate: evaluation.getExpirationDate(),

            score: evaluation.getScore()

        }));

    }

}