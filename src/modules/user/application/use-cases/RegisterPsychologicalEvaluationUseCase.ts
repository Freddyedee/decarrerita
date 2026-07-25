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
        
        console.log(`\n--------------------------------------------------`);
        console.log(`🧪 [RegisterPsychologicalEvaluation] Iniciando evaluación...`);
        console.log(`👤 Chofer ID: ${request.driverUserId} | Nota recibida: ${request.score}`);

        // 1. Verificamos que el chofer exista
        const driver = await this.driverRepository.findByUserId(request.driverUserId);
        if (!driver) {
            console.error(`❌ Chofer ID ${request.driverUserId} no existe.`);
            throw new Error("Driver not found.");
        }

        // 2. Reglas de Negocio
        if (request.score < 0 || request.score > 100) {
            throw new Error("La calificación debe estar entre 0 y 100.");
        }

        const resultStr = request.score >= 73 
            ? PsychologicalEvaluationResult.APPROVED 
            : PsychologicalEvaluationResult.REJECTED;

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        // 3. Creación de la Entidad
        const evaluation = new PsychologicalEvaluation(
            null,
            request.driverUserId,
            new Date(),
            request.observations,
            expirationDate,
            request.score
        );

        // 4. Guardamos la evaluación psicológica
        const savedEvaluation = await this.evaluationRepository.save(evaluation);

        if (savedEvaluation.getEvaluationId() === null) {
            throw new Error("Evaluation id was not generated.");
        }
        console.log(`📝 Evaluación registrada con ID: ${savedEvaluation.getEvaluationId()}`);

        // 5. LÓGICA DE APROBACIÓN CON LOGS DETALLADOS
        if (request.score >= 73) {
            console.log(`🟢 Nota APROBATORIA (${request.score} >= 73). Verificando vehículo...`);
            
            // Verificamos si tiene vehículo aprobado
            const tieneVehiculoAprobado = await this.driverRepository.hasApprovedVehicle(request.driverUserId);
            console.log(`🚗 ¿Chofer tiene al menos 1 vehículo APROBADO en BD?: ${tieneVehiculoAprobado ? 'SÍ' : 'NO'}`);

            if (tieneVehiculoAprobado) {
                console.log(`🎉 ¡Cumple ambos requisitos! Promoviendo a estado APROBADO...`);
                await this.driverRepository.updateStatus(request.driverUserId, "aprobado");
            } else {
                console.log(`⏳ Falta aprobación del vehículo. Se mantiene en estado PENDIENTE.`);
                await this.driverRepository.updateStatus(request.driverUserId, "pendiente");
            }
        } else {
            console.log(`🔴 Nota REPROBATORIA (${request.score} < 73). Cambiando estado a RECHAZADO...`);
            await this.driverRepository.updateStatus(request.driverUserId, "rechazado");
        }

        console.log(`--------------------------------------------------\n`);

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