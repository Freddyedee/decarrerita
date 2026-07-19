// infrastructure/prisma/revision.repository.ts

import { prisma } from "@/shared/lib/prisma";
import { RevisionVehicular } from "../../domain/entities/RevisionVehicular";
import { IRevisionRepository } from "../../domain/repositories/IRevisionVehicular";
import { revisionMapper } from "../mappers/revision.mapper";

export class RevisionRepository implements IRevisionRepository {

    async create(revision: RevisionVehicular): Promise<RevisionVehicular> {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id_revision: _id_revision, ...data } = revisionMapper.toPersistence(revision);

        const created = await prisma.revision_vehicular.create({
            data
        });

        return revisionMapper.toDomain(created);
    }

    async findById(id: number): Promise<RevisionVehicular | null> {

        const revision = await prisma.revision_vehicular.findUnique({
            where: { id_revision: id }
        });

        if (!revision) {
            return null;
        }

        return revisionMapper.toDomain(revision);
    }

    async findByVehicleId(vehicleId: number): Promise<RevisionVehicular[]> {

        const revisions = await prisma.revision_vehicular.findMany({
            where: { id_vehiculo: vehicleId },
            orderBy: { fecha_revision: "desc" }
        });

        return revisions.map(r => revisionMapper.toDomain(r));
    }

    async findLatestByVehicleId(vehicleId: number): Promise<RevisionVehicular | null> {

        const revision = await prisma.revision_vehicular.findFirst({
            where: { id_vehiculo: vehicleId },
            orderBy: { fecha_revision: "desc" }
        });

        if (!revision) {
            return null;
        }

        return revisionMapper.toDomain(revision);
    }

    // infrastructure/prisma/revision.repository.ts — agregar

    async findLatestByVehicleIds(vehicleIds: number[]): Promise<RevisionVehicular[]> {

        // Prisma no tiene "traer el más reciente por grupo" nativo
        // en una sola query simple, así que se resuelve trayendo
        // todas las revisiones de esos vehículos ordenadas, y
        // quedándonos con la primera de cada uno en memoria.
        const revisiones = await prisma.revision_vehicular.findMany({
            where: { id_vehiculo: { in: vehicleIds } },
            orderBy: { fecha_revision: "desc" }
        });

        const masRecientePorVehiculo = new Map<number, typeof revisiones[number]>();

        for (const r of revisiones) {
            if (!masRecientePorVehiculo.has(r.id_vehiculo)) {
                masRecientePorVehiculo.set(r.id_vehiculo, r);
            }
        }

        return Array.from(masRecientePorVehiculo.values()).map(r => revisionMapper.toDomain(r));
    }
}