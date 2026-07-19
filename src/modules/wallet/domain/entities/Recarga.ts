import { EstadoRecarga } from "../enums/EstadoRecarga";

/**
 * ============================================================
 * Entity: Recarga
 * ============================================================
 *
 * Representa la DECLARACIÓN de un cliente de haber transferido
 * dinero a la cuenta bancaria de la empresa, para que se le
 * acredite en su wallet.
 *
 * RN-032: registrar una Recarga NO mueve saldo por sí sola —
 * es solo evidencia (banco + referencia + monto) de una
 * transferencia que el cliente afirma haber hecho. El saldo
 * solo se acredita cuando el estado pasa a APROBADA (acción
 * administrativa, fuera del alcance de esta iteración — ver
 * SolicitarRecargaUseCase). Modelarlo así, en vez de acreditar
 * de inmediato, evita que cualquier cliente pueda inflar su
 * saldo con solo escribir un número de referencia falso.
 *
 * ============================================================
 */
export class Recarga {

    constructor(
        public readonly id: number | null,
        public readonly walletId: number,
        public readonly bancoId: number,
        private readonly monto: number,
        private readonly referenciaPago: string,
        private status: EstadoRecarga,
        public readonly fechaSolicitud: Date,
        public readonly fechaAprobacion: Date | null
    ) {

        this.validateMonto(monto);
        this.validateReferenciaPago(referenciaPago);

    }

    private validateMonto(monto: number): void {

        if (monto <= 0) {
            throw new Error("Recharge amount must be greater than zero.");
        }

    }

    private validateReferenciaPago(referenciaPago: string): void {

        if (referenciaPago.trim().length === 0) {
            throw new Error("Payment reference cannot be empty.");
        }

    }

    getMonto(): number {
        return this.monto;
    }

    getReferenciaPago(): string {
        return this.referenciaPago;
    }

    getStatus(): EstadoRecarga {
        return this.status;
    }

    getFechaSolicitud(): Date{
        return this.fechaSolicitud;
    }
    getFechaAprobacion(): Date | null { 
        return this.fechaAprobacion;
    }
}