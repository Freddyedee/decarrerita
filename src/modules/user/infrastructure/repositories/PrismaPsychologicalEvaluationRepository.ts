import {
    PrismaClient,
    evaluacion_psicologica
} from "@prisma/client";

import { PsychologicalEvaluation } from "../../domain/entitites/PsychologicalEvaluation";
import { PsychologicalEvaluationResult } from "../../domain/enums/PsychologicalEvaluationResult";

import { IPsychologicalEvaluationRepository } from "../../application/ports/IPsychologicalEvaluationRepository";

export class PrismaPsychologicalEvaluationRepository
    implements IPsychologicalEvaluationRepository {

    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async save(
        evaluation: PsychologicalEvaluation
    ): Promise<PsychologicalEvaluation> {

        const savedEvaluation =
            await this.prisma.evaluacion_psicologica.create({

                data: {

                    id_chofer:
                        evaluation.getDriverUserId(),

                    resultado:
                        evaluation.getResult(),

                    observaciones:
                        evaluation.getObservations(),

                    fecha_vencimiento:
                        evaluation.getExpirationDate(),

                    calificacion:
                        evaluation.getScore()

                }

            });

        return this.toDomain(savedEvaluation);

    }

    async findByDriverUserId(
        driverUserId: number
    ): Promise<PsychologicalEvaluation[]> {

        const evaluations =
            await this.prisma.evaluacion_psicologica.findMany({

                where: {
                    id_chofer: driverUserId
                },

                orderBy: {
                    fecha_evaluacion: "desc"
                }

            });

        return evaluations.map(evaluation =>
            this.toDomain(evaluation)
        );

    }

    private toDomain(
        evaluation: evaluacion_psicologica
    ): PsychologicalEvaluation {

        return new PsychologicalEvaluation(

            evaluation.id_evaluacion,

            evaluation.id_chofer,

            evaluation.fecha_evaluacion,

            evaluation.resultado as PsychologicalEvaluationResult,

            evaluation.observaciones,

            evaluation.fecha_vencimiento,

            evaluation.calificacion

        );

    }

}