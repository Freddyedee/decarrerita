import {
    PrismaClient,
    evaluacion_psicologica
} from "@prisma/client";

import { PsychologicalEvaluation } from "../../domain/entitites/PsychologicalEvaluation";

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

    /**
     * Nótese que NO se pasa `evaluation.resultado` acá — el
     * constructor de PsychologicalEvaluation vuelve a calcular
     * el resultado a partir de `calificacion` (RN-029). La
     * columna `resultado` en la base de datos queda como un
     * espejo/histórico de ese cálculo (se sigue escribiendo en
     * `save()`, vía `evaluation.getResult()`), pero nunca es la
     * fuente de verdad al reconstruir la entidad.
     */
    private toDomain(
        evaluation: evaluacion_psicologica
    ): PsychologicalEvaluation {

        return new PsychologicalEvaluation(

            evaluation.id_evaluacion,

            evaluation.id_chofer,

            evaluation.fecha_evaluacion,

            evaluation.observaciones,

            evaluation.fecha_vencimiento,

            evaluation.calificacion

        );

    }

}