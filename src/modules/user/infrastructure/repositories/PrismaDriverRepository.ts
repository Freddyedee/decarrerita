import { PrismaClient, Prisma, chofer } from "@prisma/client";
import { Driver } from "../../domain/entitites/Driver";
import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";
import { IDriverRepository } from "../../application/ports/IDriverRepository";

export class PrismaDriverRepository implements IDriverRepository {

    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async findByUserId(userId: number): Promise<Driver | null> {
        const driver = await this.prisma.chofer.findUnique({
            where: { id_usuario: userId }
        });

        if (!driver) {
            return null;
        }

        return this.toDomain(driver);
    }

    /**
     * RN-026/RN-027: crea la fila `chofer` dentro de la misma transacción.
     */
    async create(
        userId: number,
        licenseNumber: DriverLicense,
        status: ApprovalStatus,
        bankId: number | null, // <-- NUESTRO APORTE: Recibe el Banco
        tx?: Prisma.TransactionClient
    ): Promise<Driver> {
        const db = tx ?? this.prisma;

        const created = await db.chofer.create({
            data: {
                id_usuario: userId,
                licencia: licenseNumber.getValue(),
                estado_aprobacion: status,
                id_banco: bankId // <-- NUESTRO APORTE: Guarda el Banco (verifica que tu schema de Prisma use "id_banco")
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
                licencia: driver.getLicenseNumber().getValue(),
                estado_aprobacion: driver.getStatus(),
                puntaje_promedio: driver.getAverageRating(),
                viajes_completados: driver.getCompletedTrips(),
                id_banco: driver.getBankId() // <-- NUESTRO APORTE: Actualiza el Banco
            }
        });

        return this.toDomain(updatedDriver);
    }

    private toDomain(driver: chofer): Driver {
        return new Driver(
            driver.id_usuario,
            DriverLicense.create(driver.licencia),
            driver.estado_aprobacion as ApprovalStatus,
            Number(driver.puntaje_promedio ?? 5),
            driver.viajes_completados,
            driver.id_banco // <-- NUESTRO APORTE: Hidrata la entidad con el Banco
        );
    }

    /**
     * RN-031: devuelve solo el `puntaje_promedio` (Lógica del compañero conservada)
     */
    async findPuntajeByChoferId(id: number): Promise<number> {
        const driver = await this.prisma.chofer.findUnique({ where: { id_usuario: id } });
        if (!driver) throw new Error("Driver not found");
        return Number(driver.puntaje_promedio ?? 0);
    }

    // Mantenemos tu método por si lo usaste en tu rama
    async updateStatus(driverUserId: number, status: string): Promise<void> {
        await this.prisma.chofer.update({
            where: { id_usuario: driverUserId },
            data: { estado_aprobacion: status }
        });
    }
}