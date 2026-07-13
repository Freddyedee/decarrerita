import { EstadoRespuesta } from "../Enum/EstadoRespuesta";


/**
 * Representa una oferta de traslado hecha a un chofer
 * candidato específico, dentro de una cola ordenada por
 * prioridad (basada en su puntaje_promedio).
 *
 * Varias AsignacionChofer pueden existir para un mismo
 * traslado — una por cada candidato al que se le ofreció,
 * en el orden en que se le ofreció.
 */

export class AsignacionChofer{ 

    constructor (
        public readonly id: number,
        public readonly trasladoId: number, 
        public readonly choferId: number, 
        public readonly prioridad: number, 
        public estadoRespuesta: EstadoRespuesta
    ){}

    aceptar(): void{
        if(this.estadoRespuesta !== EstadoRespuesta.PENDIENTE){ 
            throw new Error(`Cannot accept an offer already in state ${this.estadoRespuesta}`); 
        }

        this.estadoRespuesta = EstadoRespuesta.ACEPTADO; 
    }

    rechazar(): void { 
        if(this.estadoRespuesta !== EstadoRespuesta.PENDIENTE){ 
            throw new Error (`Cannot reject an offer already in state ${this.estadoRespuesta}`);
        }

        this.estadoRespuesta = EstadoRespuesta.RECHAZADO
    }
}