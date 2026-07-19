import { PsychologicalEvaluationResult } from "../enums/PsychologicalEvaluationResult";

export class PsychologicalEvaluation {

    private result: PsychologicalEvaluationResult;

    constructor(

        private readonly evaluationId: number | null,

        private readonly driverUserId: number,

        private readonly evaluationDate: Date,

        private observations: string,

        private expirationDate: Date,

        private score: number

    ) {

        this.validateScore(score);

        this.validateObservations(observations);

        this.validateExpirationDate(expirationDate);

        this.result = this.calculateResult(score);

    }

    //==========================
    // Validation
    //==========================

    private validateScore(score: number): void {

        if (score < 0 || score > 100) {
            throw new Error("Invalid psychological evaluation score.");
        }

    }

    private validateObservations(observations: string): void {

        if (observations.trim().length === 0) {
            throw new Error("Observations cannot be empty.");
        }

    }

    private validateExpirationDate(expirationDate: Date): void {

        if (expirationDate <= this.evaluationDate) {
            throw new Error("Expiration date must be after evaluation date.");
        }

    }

     private calculateResult(score: number): PsychologicalEvaluationResult {

        return score >= 73
            ? PsychologicalEvaluationResult.APPROVED
            : PsychologicalEvaluationResult.REJECTED;

    }
    //==========================
    // Getters
    //==========================

    public getEvaluationId(): number | null {

        return this.evaluationId;

    }

    public getDriverUserId(): number {

        return this.driverUserId;

    }

    public getEvaluationDate(): Date {

        return this.evaluationDate;

    }

    public getResult(): PsychologicalEvaluationResult {

        return this.result;

    }

    public getObservations(): string {

        return this.observations;

    }

    public getExpirationDate(): Date {

        return this.expirationDate;

    }

    public getScore(): number {

        return this.score;

    }

}