// modules/wallet/domain/Wallet.ts

/**
 * Representa el saldo de un usuario (cliente o chofer).
 * No conoce traslados ni penalizaciones directamente —
 * solo sabe manejar su propio saldo de forma segura.
 */
export class Wallet {

    constructor(
        public readonly id: number,
        public readonly usuarioId: number,
        public saldoDisponible: number,
        public saldoCongelado: number,
        public estadoBloqueo: boolean,
        public readonly moneda: string,
        public readonly fechaCreacion: Date
    ) {}

    /**
     * Una wallet bloqueada no puede debitar ni acreditar.
     */
    puedeOperar(): boolean {
        return !this.estadoBloqueo;
    }

    tieneSaldoSuficiente(monto: number): boolean {
        return this.puedeOperar() && this.saldoDisponible >= monto;
    }

    /**
     * Descuenta saldo. Lanza error si no hay fondos o
     * la wallet está bloqueada — el UseCase decide qué
     * hacer con ese error (por ejemplo, impedir iniciar
     * un traslado).
     */
    debitar(monto: number): void {
        if (!this.puedeOperar()) {
            throw new Error("Wallet is blocked");
        }
        if (this.saldoDisponible < monto) {
            throw new Error("Insufficient balance");
        }
        this.saldoDisponible -= monto;
    }

    acreditar(monto: number): void {
        if (!this.puedeOperar()) {
            throw new Error("Wallet is blocked");
        }
        this.saldoDisponible += monto;
    }
}