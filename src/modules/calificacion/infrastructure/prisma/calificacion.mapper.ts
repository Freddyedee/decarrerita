import { Calificacion } from "../../domain/Calificacion";
import { calificacion as PrismaCalificacion } from "@prisma/client/edge";

export class calificacionMapper { 

    static toDomain(raw: PrismaCalificacion): Calificacion  {
        return new Calificacion(
            raw.id_calificacion, 
            raw.id_traslado, 
            raw.id_cliente, 
            raw.id_chofer, 
            raw.calificador_es_cliente, 
            raw.puntuacion, 
            raw.comentario, 
            raw.fecha_calificacion
        ); 
    }

    static toPersistence( c: Calificacion){ 
        return { 
            id_calificacion: c.id, 
            id_traslado: c.trasladoId, 
            id_cliente: c.clienteId, 
            id_chofer: c.choferId, 
            calificador_es_cliente: c.calificadorEsCliente, 
            puntuacion: c.puntuacion, 
            comentario: c.comentario, 
            fecha_calificacion: c.fecha
        };
    }
}