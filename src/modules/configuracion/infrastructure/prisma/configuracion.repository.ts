// infrastructure/prisma/configuracion.repository.ts

import { prisma } from "@/infra/prisma/client";
import { IConfiguracionRepository } from "../../domain/repositories/IConfiguracionRepository";

export class ConfiguracionRepository implements IConfiguracionRepository {

    async findByNombre(nombre: string): Promise<string | null> {
        const config = await prisma.configuracion_sistema.findUnique({
            where: { nombre }
        });
        return config?.valor ?? null;
    }

    async setValor(nombre: string, valor: string, descripcion?: string): Promise<void> {
        await prisma.configuracion_sistema.upsert({
            where: { nombre },
            update: { valor, fecha_actualizacion: new Date() },
            create: {
                nombre,
                valor,
                descripcion: descripcion ?? "",
                fecha_actualizacion: new Date()
            }
        });
    }

    async findAll(): Promise<{ nombre: string; valor: string; descripcion: string }[]> {
        return prisma.configuracion_sistema.findMany();
    }
}