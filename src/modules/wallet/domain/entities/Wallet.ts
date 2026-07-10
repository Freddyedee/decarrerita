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
    canOperate(): boolean {
        return !this.estadoBloqueo;
    }

    tieneSaldoSuficiente(monto: number): boolean {
        return this.canOperate() && this.saldoDisponible >= monto;
    }
   

      /**
     * RN-025 (primera mitad): un saldo negativo bloquea nuevas
     * operaciones económicas. Este método responde "¿puede este
     * usuario iniciar una operación nueva ahora mismo?" — se usa
     * ANTES de solicitar un viaje o aceptar uno, nunca durante
     * el cobro/pago en sí.
     */

      negativeBalance(): boolean {
        return this.saldoDisponible < 0; 
      }

      canStartNewOperation(): boolean{
        return this.canOperate() && !this.negativeBalance();
      }

    /**
     * Débito NORMAL (cobro de un viaje). Nunca puede dejar
     * saldo negativo — si no alcanza, se rechaza la operación
     * completa (ej. no se puede iniciar un viaje sin fondos).
     */

     debitar(monto: number): void {
        if (!this.canOperate()) {
            throw new Error("Wallet is blocked");
        }
        if (this.saldoDisponible < monto) {
            throw new Error("Insufficient balance");
        }
        this.saldoDisponible -= monto;
    }

     /**
     * Débito por PENALIZACIÓN (RN-025, segunda mitad). A
     * diferencia de debitar(), esta operación SÍ puede dejar
     * saldo negativo — la penalización es una deuda que el
     * negocio tiene derecho a cobrar, incluso si el usuario
     * no tiene fondos en este momento. La consecuencia no es
     * bloquear esta operación, sino bloquear las FUTURAS
     * (ver canStartNewOperation)
     */

     toDebitPenalization(monto: number): void {
        if(!this.canOperate()){
            throw new Error("Wallet is blocked");
        }

        this.saldoDisponible -= monto; 
     }

     
    /**
     * Descuenta saldo. Lanza error si no hay fondos o
     * la wallet está bloqueada — el UseCase decide qué
     * hacer con ese error (por ejemplo, impedir iniciar
     * un traslado).
     */
     
    acreditar(monto: number): void {
        if (!this.canOperate()) {
            throw new Error("Wallet is blocked");
        }
        this.saldoDisponible += monto;
    }
     




}