// infrastructure/prisma/revision.mapper.ts

import { RevisionVehicular } from "../../domain/entities/RevisionVehicular";
import { revision_vehicular as PrismaRevision } from "@prisma/client";

export class revisionMapper {

    // Prisma -> Domain
    static toDomain(raw: PrismaRevision): RevisionVehicular {

        return new RevisionVehicular(
            raw.id_revision,
            raw.id_vehiculo,
            raw.calificacion,
            raw.fecha_revision,
            raw.observaciones,
            raw.fecha_vencimiento
        );
    }

    // Domain -> Prisma
    static toPersistence(revision: RevisionVehicular) {

        return {
            id_revision:       revision.id,
            id_vehiculo:       revision.vehicleId,
            calificacion:      revision.score,
            fecha_revision:    revision.date,
            observaciones:     revision.observations,
            fecha_vencimiento: revision.expirationDate,
            // El resultado se deriva, pero la BD lo guarda como
            // columna para optimizar búsquedas.
            resultado:         revision.getResult()
        };
    }
}