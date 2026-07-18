/**
 * ============================================================
 * Entity: Client
 * ============================================================
 *
 * Especialización de User para el rol CLIENTE. Igual que Driver,
 * vive 1:1 con `usuario` y SIEMPRE se crea junto con su User
 * (RN-026, ver CreateUserUseCase) — a diferencia de Driver, no
 * requiere ningún dato adicional al registrarse (no hay licencia
 * ni aprobación pendiente), por eso su creación es más simple:
 * un cliente puede operar en el sistema desde el instante en que
 * se registra.
 *
 * ============================================================
 */
export class Client {
    constructor(
        public readonly userId: number,

        private averageRating: number
    ) {}

    /**
     * Igual que en Driver: este rating lo recalcula el módulo
     * Traslado a partir de las calificaciones que los choferes le
     * dan al cliente después de cada viaje. Esta entidad solo
     * valida el rango físico (0-5).
     */
    changeAverageRating(
        averageRating: number
    ): void {

        if (averageRating < 0 || averageRating > 5) {
            throw new Error("Invalid average rating.");
        }

        this.averageRating = averageRating;

    }

    getAverageRating(): number {
        return this.averageRating;
    }

    getUserId(): number {
        return this.userId;
    }
}