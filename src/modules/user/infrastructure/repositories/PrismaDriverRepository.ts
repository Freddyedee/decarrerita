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

    async updateAvailability(driverUserId: number, isAvailable: boolean): Promise<void> {
        await this.prisma.chofer.update({
            where: {
                id_usuario: driverUserId
            },
            data: {
                disponible: isAvailable
            }
        });
    }

    /**
     * Busca todos los choferes disponibles cuyo vehículo y perfil psicológico 
     * cumplan estrictamente con las reglas de negocio del sistema:
     * - Nota psicológica >= 73 (y no vencida)
     * - Nota revisión vehicular >= 65 (y no vencida)
     */
    async findAvailableAndAptDrivers(): Promise<any[]> {
        const choferesAptos = await this.prisma.$queryRaw`
            WITH ultima_evaluacion AS (
                SELECT id_chofer, calificacion, fecha_vencimiento
                FROM (
                    SELECT 
                        id_chofer, 
                        calificacion, 
                        fecha_vencimiento,
                        ROW_NUMBER() OVER(PARTITION BY id_chofer ORDER BY fecha_evaluacion DESC) as rn
                    FROM evaluacion_psicologica
                ) t
                WHERE rn = 1
            ),
            ultima_revision AS (
                SELECT id_vehiculo, calificacion, fecha_vencimiento
                FROM (
                    SELECT 
                        id_vehiculo, 
                        calificacion, 
                        fecha_vencimiento,
                        ROW_NUMBER() OVER(PARTITION BY id_vehiculo ORDER BY fecha_revision DESC) as rn
                    FROM revision_vehicular
                ) t
                WHERE rn = 1
            )
            SELECT 
                c.id_usuario AS id_chofer,
                u.nombre AS nombre_chofer,
                u.telefono,
                v.id_vehiculo,
                v.placa,
                v.modelo,
                ue.calificacion AS nota_psicologica,
                ur.calificacion AS nota_vehicular
            FROM chofer c
            INNER JOIN usuario u ON c.id_usuario = u.id_usuario
            INNER JOIN vehiculo v ON c.id_usuario = v.id_chofer
            INNER JOIN ultima_evaluacion ue ON c.id_usuario = ue.id_chofer
            INNER JOIN ultima_revision ur ON v.id_vehiculo = ur.id_vehiculo
            WHERE c.disponible = true
              AND c.estado_aprobacion = 'APROBADO'
              AND v.estado = 'activo'
              AND ue.calificacion >= 73
              AND ue.fecha_vencimiento >= CURRENT_DATE
              AND ur.calificacion >= 65
              AND ur.fecha_vencimiento >= CURRENT_DATE;
        `;

        return choferesAptos as any[];
    }

    
}