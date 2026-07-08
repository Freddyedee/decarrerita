import { PsychologicalEvaluation } from "../../domain/entitites/PsychologicalEvaluation";

export interface IPsychologicalEvaluationRepository {

    save(
        evaluation: PsychologicalEvaluation
    ): Promise<PsychologicalEvaluation>;

    findByDriverUserId(
        driverUserId: number
    ): Promise<PsychologicalEvaluation[]>;

}