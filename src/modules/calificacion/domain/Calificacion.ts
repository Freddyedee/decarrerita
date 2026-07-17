
export class Calificacion {

    static readonly PUNTUACION_MIN = 1; 
    static readonly PUNTUACION_MAX = 5; 

    constructor(
        public readonly id: number, 
        public readonly trasladoId: number, 
        public readonly clienteId: number,
        public readonly choferId: number, 
        public readonly calificadorEsCliente: boolean, 
        public readonly puntuacion: number, 
        public readonly comentario: string | null,
        public readonly fecha: Date
    ){}

    esValida(): boolean { 
        return this.puntuacion >= Calificacion.PUNTUACION_MIN && this.puntuacion <= Calificacion.PUNTUACION_MAX; 
    }
}