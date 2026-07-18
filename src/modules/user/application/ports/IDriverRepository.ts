import { Driver } from "../../domain/entitites/Driver";
import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";
import { Prisma } from "@prisma/client";

export interface IDriverRepository {

    findByUserId(userId: number): Promise<Driver | null>;

    /**
     * RN-026/RN-027: crea la fila especializada `chofer` para un
     * `usuario` ya existente, dentro de la misma transacción que
     * lo creó (ver CreateUserUseCase). A diferencia de Client,
     * requiere licencia (columna NOT NULL/UNIQUE en la BD) y
     * SIEMPRE nace en estado PENDIENTE — nunca se auto-aprueba
     * (RN-027, ver entidad Driver).
     */
    create(
        userId: number,
        licenseNumber: DriverLicense,
        status: ApprovalStatus,
        tx?: Prisma.TransactionClient
    ): Promise<Driver>;

    update(driver: Driver, tx?: Prisma.TransactionClient): Promise<Driver>;

    /**
     * RN-031: usado por SolicitarTrasladoUseCase (módulo
     * Traslado) para ordenar por prioridad la cola de choferes
     * candidatos a un viaje. A propósito devuelve `number` (el
     * rating promedio, no la entidad Driver completa) — el
     * caller solo necesita comparar puntajes para ordenar, y
     * mantenerlo como número simple evita tener que "desenvolver"
     * la entidad en un módulo que no es dueño de ella.
     *
     * ⚠️ Antes devolvía `Promise<Driver>`, lo que rompía
     * silenciosamente el ordenamiento en Traslado (comparaba
     * `Number(driverObject)`, que siempre da NaN). Se corrigió
     * acá para que el tipo coincida con el uso real.
     */
    findPuntajeByChoferId(id: number): Promise<number>;

}