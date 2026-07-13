import { PrismaClient, chofer } from "@prisma/client";

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

    async update(
        driver: Driver
    ): Promise<Driver> {

        const updatedDriver = await this.prisma.chofer.update({

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

    async findPuntajeByChoferId(id: number): Promise<Driver> {
        const driver = await this.prisma.chofer.findUnique({ where: { id_usuario: id } });
        if (!driver) throw new Error("Driver not found");
        return this.toDomain(driver);

    }
}