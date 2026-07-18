import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

import { Recarga } from "../../domain/entities/Recarga";
import { EstadoRecarga } from "../../domain/enums/EstadoRecarga";
import { IRecargaRepository } from "../../domain/ports/IRecargaRepository";
import { recargaMapper } from "./recarga.mapper";

export class RecargaRepository implements IRecargaRepository {

    // 1. Delegación de contexto añadida para soportar transacciones
    async create(recarga: Recarga, tx?: Prisma.TransactionClient): Promise<Recarga> {
        const db = tx || prisma; 

        const created = await db.recarga.create({
            data: {
                id_wallet: recarga.walletId,
                id_banco: recarga.bancoId,
                monto: recarga.getMonto(),
                referencia_pago: recarga.getReferenciaPago(),
                estado: recarga.getStatus()
            }
        });

        return recargaMapper.toDomain(created);
    }

    // 2. Búsqueda por ID con soporte transaccional
    async findById(id: number, tx?: Prisma.TransactionClient): Promise<Recarga | null> {
        const db = tx || prisma;

        const recarga = await db.recarga.findUnique({
            where: { id_recarga: id }
        });

        if (!recarga) return null;

        return recargaMapper.toDomain(recarga);
    }

    // 3. Historial del cliente (descendente)
    async findByWalletId(walletId: number): Promise<Recarga[]> {
        const recargas = await prisma.recarga.findMany({
            where: {
                id_wallet: walletId
            },
            // Orden descendente porque los historiales muestran lo más reciente arriba
            orderBy: {
                fecha_solicitud: "desc"
            }
        });

        return recargas.map(recarga => recargaMapper.toDomain(recarga));
    }

    // 4. Panel del Administrador (ascendente)
    async findPending(): Promise<Recarga[]> {
        const recargas = await prisma.recarga.findMany({
            where: {
                estado: EstadoRecarga.PENDIENTE // O "PENDIENTE" dependiendo de tu Enum
            },
            // Orden ascendente para que los administradores atiendan por orden de llegada
            orderBy: {
                fecha_solicitud: "asc"
            }
        });

        return recargas.map(recarga => recargaMapper.toDomain(recarga));
    }

    // 5. Actualización de estado
    async update(recarga: Recarga, tx?: Prisma.TransactionClient): Promise<Recarga> {
        const db = tx || prisma;

        // 1. Extraemos el ID (usa recarga.id o recarga.getId() según cómo esté en tu entidad)
        const idRecarga = recarga.id; 

        // 2. GUARD CLAUSE: Le garantizamos a TypeScript que el ID existe
        if (idRecarga === null || idRecarga === undefined) {
            throw new Error("No se puede actualizar una recarga que no tiene ID (no ha sido persistida).");
        }

        // 3. Prisma ahora acepta idRecarga felizmente porque sabe que es un 'number'
        const updated = await db.recarga.update({
            where: {
                id_recarga: idRecarga 
            },
            data: {
                estado: recarga.getStatus(),
                // Asegúrate de usar el método/propiedad correcta para la fecha según tu entidad
                fecha_aprobacion: recarga.getFechaAprobacion ? recarga.getFechaAprobacion() : undefined 
            }
        });

        return recargaMapper.toDomain(updated);
    }
}