// infrastructure/prisma/tarifa.repository.ts

import { prisma } from "@/shared/lib/prisma";
import { Tarifa } from "../../domain/entities/Tarifa";
import { ITarifaRepository } from "../../domain/repositories/ITarifaRepository";
import { tarifaMapper } from "../mappers/tarifa.mapper";

export class TarifaRepository implements ITarifaRepository {

    async create(tarifa: Tarifa): Promise<Tarifa> {
        const { id_tarifa, ...data } = tarifaMapper.toPersistence(tarifa);
        const created = await prisma.tarifa.create({ data });
        return tarifaMapper.toDomain(created);
    }

    async findVigente(referenceDate: Date = new Date()): Promise<Tarifa | null> {

        const tarifa = await prisma.tarifa.findFirst({
            where: {
                fecha_inicio_vigencia: { lte: referenceDate },
                OR: [
                    { fecha_fin_vigencia: null },
                    { fecha_fin_vigencia: { gte: referenceDate } }
                ]
            },
            orderBy: { fecha_inicio_vigencia: "desc" }
        });

        return tarifa ? tarifaMapper.toDomain(tarifa) : null;
    }

    async findAll(): Promise<Tarifa[]> {
        const tarifas = await prisma.tarifa.findMany({
            orderBy: { fecha_inicio_vigencia: "desc" }
        });
        return tarifas.map(t => tarifaMapper.toDomain(t));
    }

    async closeVigencia(id: number, fechaFin: Date): Promise<void> {
        await prisma.tarifa.update({
            where: { id_tarifa: id },
            data: { fecha_fin_vigencia: fechaFin }
        });
    }
}