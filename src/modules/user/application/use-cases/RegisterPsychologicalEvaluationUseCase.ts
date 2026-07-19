import { PsychologicalEvaluation } from "../../domain/entitites/PsychologicalEvaluation";
import { PsychologicalEvaluationResponse } from "../dto/PsychologicalEvaluationResponse";
import { RegisterPsychologicalEvaluationRequest } from "../dto/RegisterPsychologicalEvaluationRequest";
import { IDriverRepository } from "../ports/IDriverRepository";
import { IPsychologicalEvaluationRepository } from "../ports/IPsychologicalEvaluationRepository";
import { PsychologicalEvaluationResult } from "../../domain/enums/PsychologicalEvaluationResult";

export class RegisterPsychologicalEvaluationUseCase {
    constructor(
        private readonly driverRepository: IDriverRepository,
        private readonly evaluationRepository: IPsychologicalEvaluationRepository
    ) {}

    async execute(
        request: RegisterPsychologicalEvaluationRequest
    ): Promise<PsychologicalEvaluationResponse> {
        
        // 1. Verificamos que el chofer exista
        const driver = await this.driverRepository.findByUserId(request.driverUserId);
        if (!driver) {
            throw new Error("Driver not found.");
        }

        // 2. Reglas de Negocio inyectadas en el Dominio
        if (request.score < 0 || request.score > 100) {
            throw new Error("La calificación debe estar entre 0 y 100.");
        }

        const resultStr = request.score >= 73 ? "aprobado" : "rechazado";
        const resultEnum = resultStr as PsychologicalEvaluationResult;

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        // 3. Creación de la Entidad
        const evaluation = new PsychologicalEvaluation(
            null,
            request.driverUserId,
            new Date(),
            resultEnum,
            request.observations,
            expirationDate,
            request.score
        );

        // 4. Guardado en Repositorios
        const savedEvaluation = await this.evaluationRepository.save(evaluation);

        if (savedEvaluation.getEvaluationId() === null) {
            throw new Error("Evaluation id was not generated.");
        }

        // ACTUALIZACIÓN DEL ESTADO DEL CHOFER
        // Nota: Asegúrate de tener un método similar a updateStatus en tu IDriverRepository
        await this.driverRepository.updateStatus(request.driverUserId, resultStr);

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