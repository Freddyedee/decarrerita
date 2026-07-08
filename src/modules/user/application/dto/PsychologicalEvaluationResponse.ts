import { PsychologicalEvaluationResult } from "../../domain/enums/PsychologicalEvaluationResult";

export interface PsychologicalEvaluationResponse {

    evaluationId: number;

    driverUserId: number;

    evaluationDate: Date;

    result: PsychologicalEvaluationResult;

    observations: string;

    expirationDate: Date;

    score: number;

}