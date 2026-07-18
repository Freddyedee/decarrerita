import { ApprovalStatus } from "../enums/ApprovalStatus";
import { DriverLicense } from "../value-objects/DriverLicense";

/**
 * ============================================================
 * Entity: Driver
 * ============================================================
 *
 * Especialización de User para el rol CHOFER. Vive en una
 * relación 1:1 con `usuario` (mismo id_usuario como PK, ver
 * schema) y SIEMPRE se crea junto con su User — nunca por
 * separado (RN-026, ver CreateUserUseCase).
 *
 * RN-027: un chofer NUNCA se auto-aprueba. Su estado inicial al
 * registrarse es siempre PENDIENTE — pasar a APROBADO es una
 * decisión exclusiva del personal administrativo (ver
 * UpdateDriverStatusUseCase), y esa transición además exige que
 * ya existan al menos 2 contactos de emergencia activos
 * (RN-028) registrados para este chofer.
 *
 * Esta entidad, a propósito, NO conoce evaluaciones psicológicas
 * ni contactos de emergencia — esos son otras entidades del
 * mismo módulo. Aquí solo vive el estado resultante (¿está
 * aprobado o no?) y las métricas operativas (rating, viajes).
 * Quién decide CUÁNDO cambiar ese estado es responsabilidad del
 * UseCase correspondiente, no de esta entidad.
 *
 * ============================================================
 */
export class Driver {
    constructor(
        public readonly userId: number,
        private licenseNumber: DriverLicense,
        private status: ApprovalStatus,
        private averageRating: number,
        private completedTrips: number | null
    ) {}

    /**
     * Cambia el estado de aprobación del chofer. A propósito NO
     * valida transiciones acá (ej. no impide PENDIENTE -> SUSPENDIDO
     * directo) — eso permite flexibilidad administrativa (un admin
     * puede suspender a un chofer aprobado en cualquier momento).
     * La única regla que SÍ se hace cumplir sobre esta transición
     * (mínimo 2 contactos de emergencia para llegar a APROBADO,
     * RN-028) vive en UpdateDriverStatusUseCase, no acá, porque
     * requiere consultar otro repositorio (contactos de emergencia)
     * que esta entidad no conoce.
     */
    changeStatus(
        status: ApprovalStatus
    ): void {

        this.status = status;
    }

    
    public updateLicense(
        licenseNumber: DriverLicense,
    ): void {
        this.licenseNumber = licenseNumber;
    }

    /**
     * Actualiza rating promedio y viajes completados. Estos
     * valores en la práctica los recalcula el módulo Traslado
     * (después de cada calificación/viaje completado) — esta
     * entidad solo valida que el rango sea físicamente posible
     * (0-5, y viajes no negativos), no vuelve a calcular el
     * promedio desde cero.
     *
     * RN-031: el rating acá guardado es justamente el valor que
     * SolicitarTrasladoUseCase (módulo Traslado) usa para
     * ordenar por prioridad la cola de choferes candidatos a un
     * viaje — a mayor rating, primero recibe la oferta. Por eso
     * `findPuntajeByChoferId` (ver IDriverRepository) devuelve
     * este número directamente, no la entidad completa.
     */
    changeMetrics(averageRating: number,completedTrips: number): void {

        if (averageRating < 0 || averageRating > 5) {
            throw new Error("Invalid average rating.");
        }

        if (completedTrips < 0) {
            throw new Error("Completed trips cannot be negative.");
        }

        this.averageRating = averageRating;

        this.completedTrips = completedTrips;

    }

    changeLicense(licenseNumber: DriverLicense): void {

        this.licenseNumber = licenseNumber;

    }

    isApproved(): boolean {
        return this.status === ApprovalStatus.APROBADO;
    }

    getAverageRating(): number {
        return this.averageRating;
    }

    getCompletedTrips(): number | null {
        return this.completedTrips;
    }

    getStatus(): ApprovalStatus {
        return this.status;
    }

    getUserId(): number {
        return this.userId;
    }

    getLicenseNumber(): DriverLicense {
        return this.licenseNumber;
    }
}