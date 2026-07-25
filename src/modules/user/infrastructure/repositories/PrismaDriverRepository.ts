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

    // En PrismaDriverRepository.ts
async hasApprovedVehicle(driverUserId: number): Promise<boolean> {
        // 1. Consultamos los vehículos del chofer e incluimos su última revisión vehicular
        const vehiculos = await this.prisma.vehiculo.findMany({
            where: { id_chofer: driverUserId },
            include: {
                revision_vehicular: {
                    orderBy: { fecha_revision: 'desc' },
                    take: 1
                }
            }
        });

        console.log(`🚙 [DEBUG hasApprovedVehicle] Total de vehículos para Chofer ID ${driverUserId}: ${vehiculos.length}`);

        // 2. Un vehículo se considera APROBADO si su estado es 'activo'/'aprobado'
        //    O SI tiene una revisión en la tabla 'revision_vehicular' con nota >= 65
        const tieneAprobado = vehiculos.some(v => {
            const estadoReal = (v.estado || "").trim().toLowerCase();
            const esEstadoActivo = estadoReal === "activo" || estadoReal === "aprobado" || estadoReal === "inactivo";

            const ultimaRevision = v.revision_vehicular[0];
            const tieneRevisionAprobada = ultimaRevision ? (ultimaRevision.calificacion >= 65) : false;

            console.log(`   -> Vehículo Placa [${v.placa}]: estado="${v.estado}" | Última nota revisión=${ultimaRevision ? ultimaRevision.calificacion : 'Sin revisión'}`);

            return esEstadoActivo || tieneRevisionAprobada;
        });

        console.log(`🎯 [DEBUG] ¿Resultado final de la validación de vehículo?: ${tieneAprobado ? 'SÍ (true)' : 'NO (false)'}`);

        return tieneAprobado;
    }

    // 2. IMPLEMENTACIÓN DE PRUEBA PSICOLÓGICA APROBADA
    async hasPassedPsychologicalTest(driverUserId: number): Promise<boolean> {
        const count = await this.prisma.evaluacion_psicologica.count({
            where: {
                id_chofer: driverUserId,
                OR: [
                    { calificacion: { gte: 73 } },
                    { resultado: "APROBADO" },
                    { resultado: "APROBADA" },
                    { resultado: "aprobado" },
                    { resultado: "aprobada" }
                ]
            }
        });

        return count > 0; // Devuelve true si tiene al menos una evaluación con nota >= 73
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
    /**
     * Busca todos los choferes disponibles con auditoría de Logs
     */
    async findAvailableAndAptDrivers(): Promise<any[]> {
        console.log("\n--------------------------------------------------");
        console.log("🚨 [DEBUG SOLICITUD TRASLADO] Escaneando choferes en tiempo real...");

        // 1. AUDITORÍA: ¿Quiénes tienen disponible = true en este segundo?
        const choferesOnline = await this.prisma.$queryRaw`
            SELECT c.id_usuario, c.disponible, c.estado_aprobacion, u.nombre
            FROM chofer c
            INNER JOIN usuario u ON c.id_usuario = u.id_usuario
            WHERE c.disponible = true;
        `;
        console.log("📡 1. Choferes con disponible=true:", JSON.stringify(choferesOnline, null, 2));

        // 2. AUDITORÍA: ¿Qué vehículos existen y cuál es su estado exacto en BD?
        const detalleVehiculos = await this.prisma.$queryRaw`
            SELECT v.id_vehiculo, v.id_chofer, v.placa, v.estado AS estado_vehiculo, 
                   ur.calificacion AS nota_vehicular, ur.fecha_vencimiento AS vence_vehicular
            FROM vehiculo v
            LEFT JOIN (
                SELECT id_vehiculo, calificacion, fecha_vencimiento,
                       ROW_NUMBER() OVER(PARTITION BY id_vehiculo ORDER BY fecha_revision DESC) as rn
                FROM revision_vehicular
            ) ur ON v.id_vehiculo = ur.id_vehiculo AND ur.rn = 1;
        `;
        console.log("🚗 2. Estado de todos los vehículos y sus revisiones:", JSON.stringify(detalleVehiculos, null, 2));

        // 3. AUDITORÍA: ¿Cuál es la última nota psicológica de cada chofer?
        const detallePsico = await this.prisma.$queryRaw`
            SELECT ue.id_chofer, ue.calificacion AS nota_psicologica, ue.fecha_vencimiento AS vence_psicologica
            FROM (
                SELECT id_chofer, calificacion, fecha_vencimiento,
                       ROW_NUMBER() OVER(PARTITION BY id_chofer ORDER BY fecha_evaluacion DESC) as rn
                FROM evaluacion_psicologica
            ) ue WHERE rn = 1;
        `;
        console.log("🧠 3. Última evaluación psicológica por chofer:", JSON.stringify(detallePsico, null, 2));

        // 4. EJECUCIÓN DE TU CONSULTA REAL ESTRICTA
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
              AND c.estado_aprobacion = 'aprobado'
              AND v.estado = 'activo'
              AND ue.calificacion >= 73
              AND ue.fecha_vencimiento >= CURRENT_DATE
              AND ur.calificacion >= 65
              AND ur.fecha_vencimiento >= CURRENT_DATE;
        `;

        console.log("🎯 4. RESULTADO DE TU CONSULTA ESTRICTA:", JSON.stringify(choferesAptos, null, 2));
        console.log("--------------------------------------------------\n");

        return choferesAptos as any[];
    }

    
}