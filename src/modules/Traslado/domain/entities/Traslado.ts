import { EstadoTraslado } from "../Enum/EstadoTraslado";

export class Traslado {

    constructor(
        public readonly id: number,
        public readonly clienteId: number,
        public readonly choferId: number,
        public readonly vehiculoId: number,
        public readonly tarifaId: number,
        public readonly origenLat: number,
        public readonly origenLng: number,
        public readonly destinoLat: number,
        public readonly destinoLng: number,
        public readonly distanciaEstimadaKm: number,
        public readonly costoEstimado: number,
        public estadoActual: EstadoTraslado,
        public readonly fechaSolicitud: Date
    ) {}

    /**
     * Transiciones válidas del ciclo de vida.
     * Cada método documenta desde qué estado se permite
     * llegar aquí, para que el UseCase no tenga que
     * repetir esa validación en cada lugar que lo llama.
     */

    iniciar(): void {
        if (this.estadoActual !== EstadoTraslado.SOLICITADO) {
            throw new Error(`Cannot start a traslado in state ${this.estadoActual}`);
        }
        this.estadoActual = EstadoTraslado.EN_CURSO;
    }

    completar(): void {
        if (this.estadoActual !== EstadoTraslado.EN_CURSO) {
            throw new Error(`Cannot complete a traslado in state ${this.estadoActual}`);
        }
        this.estadoActual = EstadoTraslado.COMPLETADO;
    }

    /**
     * Anula el viaje. Solo es posible antes de completarse.
     * La penalización asociada (tarifa_cancelacion) se aplica
     * en el UseCase, no aquí — esta Entity solo conoce su
     * propio estado, no sabe de wallets ni penalizaciones.
     */
    
    cancelar(): void {
        if (this.estadoActual === EstadoTraslado.COMPLETADO) {
            throw new Error("Cannot cancel a traslado that has already been completed");
        }
        if (this.estadoActual === EstadoTraslado.CANCELADO) {
            throw new Error("Traslado is already cancelled");
        }
        this.estadoActual = EstadoTraslado.CANCELADO;
    }

    /**
     * Solo un traslado completado puede ser calificado
     * o generar pago al chofer.
     */
    estaCompletado(): boolean {
        return this.estadoActual === EstadoTraslado.COMPLETADO;
    }
}