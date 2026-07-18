import { Prisma } from "@prisma/client";
import { Recarga } from "../entities/Recarga"; // Tu entidad de dominio

export interface IRecargaRepository {
    
    /** Guarda una nueva solicitud de recarga en estado PENDIENTE */
    create(recarga: Recarga, tx?: Prisma.TransactionClient): Promise<Recarga>;

    /** Busca una recarga específica por su ID */
    findById(id: number, tx?: Prisma.TransactionClient): Promise<Recarga | null>;

    /** Ideal para que el cliente vea su historial ("ver su historial de recargas") */
    findByWalletId(walletId: number): Promise<Recarga[]>;

    /** Ideal para que el Admin vea todas las recargas pendientes de aprobar */
    findPending(): Promise<Recarga[]>;

    /** Actualiza el estado de la recarga (ej. de PENDIENTE a APROBADA) */
    update(recarga: Recarga, tx?: Prisma.TransactionClient): Promise<Recarga>;
}