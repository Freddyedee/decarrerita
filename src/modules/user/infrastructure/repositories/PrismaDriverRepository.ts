import { PrismaClient, Prisma, chofer } from "@prisma/client";

import { Driver } from "../../domain/entitites/Driver";

import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";

import { IDriverRepository } from "../../application/ports/IDriverRepository";

export class PrismaDriverRepository implements IDriverRepository {

    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async findByUserId(
        userId: number
    ): Promise<Driver | null> {

        const driver = await this.prisma.chofer.findUnique({

            where: {
                id_usuario: userId
            }

        });

        if (!driver) {
            return null;
        }

        return this.toDomain(driver);

    }

    /**
     * RN-026/RN-027: crea la fila `chofer` dentro de la misma
     * transacción que crea el `usuario` (parámetro `tx`). El
     * `puntaje_promedio` y `viajes_completados` quedan en sus
     * defaults de la base de datos (5.00 y 0) — no se pasan acá
     * a propósito, para no duplicar ese valor por defecto en dos
     * lugares (BD y código).
     */
    async create(
        userId: number,
        licenseNumber: DriverLicense,
        status: ApprovalStatus,
        tx?: Prisma.TransactionClient
    ): Promise<Driver> {

        const db = tx ?? this.prisma;

        const created = await db.chofer.create({

            data: {
                id_usuario: userId,
                licencia: licenseNumber.getValue(),
                estado_aprobacion: status
            }

        });

        return this.toDomain(created);

    }

    async update(
        driver: Driver,
        tx?: Prisma.TransactionClient
    ): Promise<Driver> {

        const db = tx ?? this.prisma;

        const updatedDriver = await db.chofer.update({

            where: {
                id_usuario: driver.getUserId()
            },

            data: {

                licencia:
                    driver.getLicenseNumber().getValue(),

                estado_aprobacion:
                    driver.getStatus(),

                puntaje_promedio:
                    driver.getAverageRating(),

                viajes_completados:
                    driver.getCompletedTrips()

            }

        });

        return this.toDomain(updatedDriver);

    }

    private toDomain(
        driver: chofer
    ): Driver {

        return new Driver(

            driver.id_usuario,

            DriverLicense.create(driver.licencia),

            driver.estado_aprobacion as ApprovalStatus,

            Number(driver.puntaje_promedio ?? 5),

            driver.viajes_completados

        );

    }

    /**
     * RN-031: devuelve solo el `puntaje_promedio` como número
     * plano, no la entidad Driver completa — ver el comentario
     * en IDriverRepository. Antes esta implementación devolvía
     * `this.toDomain(driver)` (un Driver completo), lo cual
     * hacía que Traslado ordenara candidatos comparando
     * `Number(driverObject)` (siempre NaN). Se corrige acá.
     */
    async findPuntajeByChoferId(id: number): Promise<number> {
        const driver = await this.prisma.chofer.findUnique({ where: { id_usuario: id } });
        if (!driver) throw new Error("Driver not found");
        return Number(driver.puntaje_promedio ?? 0);

    }
}