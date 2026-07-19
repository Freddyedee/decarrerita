export interface RegisterPsychologicalEvaluationRequest {

    driverUserId: number;
    /**
     * RN-029: NO se incluye `result` acá a propósito — el
     * resultado (APPROVED/REJECTED) lo calcula automáticamente
     * la entidad PsychologicalEvaluation comparando `score`
     * contra el mínimo aprobatorio (73). El admin solo carga la
     * nota.
     */

    observations: string;

    expirationDate: Date;

    score: number;

}