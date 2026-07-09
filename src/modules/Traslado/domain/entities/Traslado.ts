import { EstadoTraslado } from "../Enum/EstadoTraslado";

/**
 * ============================================================
 * Entity: Traslado
 * ============================================================
 *
 * Representa el ciclo de vida completo de un viaje.
 *
 * Esta entidad es la única responsable de controlar
 * las transiciones válidas entre estados.
 *
 * Ningún UseCase debe modificar estadoActual directamente.
 *
 * ============================================================
 */

export class Traslado {

    constructor(

        public readonly id:         number,
        public readonly clienteId:  number,
        public          choferId:   number,
        public          vehiculoId: number,
        public readonly tarifaId:   number,
        public readonly origenLat:  number,
        public readonly origenLng:  number,
        public readonly destinoLat: number,
        public readonly destinoLng: number,
        public readonly distanciaEstimadaKm: number,
        public readonly costoEstimado:       number,
        public estadoActual:                 EstadoTraslado,
        public readonly fechaSolicitud:      Date

    ) {}

    // ============================================================
    // TRANSICIONES DEL CICLO DE VIDA
    // ============================================================

    /**
     * El sistema comienza a buscar choferes.
     *
     * SOLICITADO
     *      ↓
     * BUSCANDO_CHOFER
     */
    buscarChofer(): void {

        if (this.estadoActual !== EstadoTraslado.SOLICITADO) {

            throw new Error(
                `Cannot search driver from state ${this.estadoActual}`
            );

        }

        this.estadoActual = EstadoTraslado.BUSCANDO_CHOFER;

    }

    /**
     * Un chofer aceptó correctamente la oferta.
     *
     * BUSCANDO_CHOFER
     *      ↓
     * ASIGNADO
     */

    /**
     * Un chofer aceptó. Recibe el id real del chofer y vehículo
     * ganadores — pueden no coincidir con los provisionales
     * usados al crear el traslado, si el primero de la cola
     * no fue quien aceptó.
     */
    asignarChofer(choferId: number, vehiculoId: number): void {

        if (this.estadoActual !== EstadoTraslado.BUSCANDO_CHOFER) {
            throw new Error(`Cannot assign driver from state ${this.estadoActual}`);
        }
        this.choferId = choferId;
        this.vehiculoId = vehiculoId;
        this.estadoActual = EstadoTraslado.ASIGNADO;
    }

     /**
     * Todos los candidatos de la cola rechazaron.
     */
    marcarSinChofer(): void {
        if (this.estadoActual !== EstadoTraslado.BUSCANDO_CHOFER) {
            throw new Error(`Cannot mark as sin_chofer from state ${this.estadoActual}`);
        }
        this.estadoActual = EstadoTraslado.SIN_CHOFER;
    }

    /**
     * El viaje comienza.
     *
     * ASIGNADO
     *      ↓
     * EN_CURSO
     */
    iniciar(): void {

        if (this.estadoActual !== EstadoTraslado.ASIGNADO) {

            throw new Error(
                `Cannot start trip from state ${this.estadoActual}`
            );

        }

        this.estadoActual = EstadoTraslado.EN_CURSO;

    }

    /**
     * El viaje termina correctamente.
     *
     * EN_CURSO
     *      ↓
     * FINALIZADO
     */
    completar(): void {

        if (this.estadoActual !== EstadoTraslado.EN_CURSO) {

            throw new Error(
                `Cannot complete trip from state ${this.estadoActual}`
            );

        }

        this.estadoActual = EstadoTraslado.FINALIZADO;

    }

    /**
     * Cancela el traslado.
     *
     * Puede cancelarse mientras
     * todavía no haya finalizado.
     */
    cancelar(): void {

        if (this.estadoActual === EstadoTraslado.FINALIZADO) {

            throw new Error(
                "Cannot cancel a completed trip."
            );

        }

        if (this.estadoActual === EstadoTraslado.CANCELADO) {

            throw new Error(
                "Trip already cancelled."
            );

        }

        this.estadoActual = EstadoTraslado.CANCELADO;

    }

    // ============================================================
    // CONSULTAS DEL DOMINIO
    // ============================================================

    /**
     * Determina si el viaje
     * todavía está activo.
     */
    estaActivo(): boolean {

        return (

            this.estadoActual !== EstadoTraslado.CANCELADO &&

            this.estadoActual !== EstadoTraslado.FINALIZADO &&

            this.estadoActual !== EstadoTraslado.SIN_CHOFER

        );

    }

    /**
     * Determina si el viaje
     * ya terminó.
     */
    estaFinalizado(): boolean {

        return this.estadoActual === EstadoTraslado.FINALIZADO;

    }

    /**
     * Determina si el sistema
     * aún está buscando chofer.
     */
    estaBuscandoChofer(): boolean {

        return this.estadoActual === EstadoTraslado.BUSCANDO_CHOFER;

    }

     /**
     * Indica si el cliente ya pagó — relevante para decidir
     * si una cancelación implica reembolso.
     */
    fueDebitadoAlCliente(): boolean {
        return this.estadoActual === EstadoTraslado.EN_CURSO
            || this.estadoActual === EstadoTraslado.FINALIZADO;
    }

}