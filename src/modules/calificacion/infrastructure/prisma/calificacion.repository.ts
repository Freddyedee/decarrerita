import { prisma } from "@/shared/lib/prisma";
import { Calificacion } from "../../domain/Calificacion";
import { ICalificacionRepository } from "../../domain/repositories/ICalificacionRepository";
import { calificacionMapper } from "./calificacion.mapper";

export class CalificacionRepository implements ICalificacionRepository { 

    async create (calificacion: Calificacion): Promise<Calificacion> { 
        const { id_calificacion, ...data} = calificacionMapper.toPersistence(calificacion); 
        const created = await prisma.calificacion.create({data}); 
        return calificacionMapper.toDomain(created); 
    }

    async findByTrasladoId (trasladoId: number): Promise <Calificacion[]> { 
        const rows = await prisma.calificacion.findMany({
            where : { id_traslado: trasladoId}
        }); 

        return rows.map(r => calificacionMapper.toDomain(r)); 
    }


    async promedioByChoferId(choferId: number): Promise <number |  null> { 

        const resultado = await prisma.calificacion.aggregate({
            where : { id_chofer: choferId, calificador_es_cliente: true}, 
            _avg : { puntuacion : true }
        }); 

        return resultado._avg.puntuacion ?? null; 
    }


    async promedioByClienteId(clienteId: number): Promise <number | null> { 
        const resultado = await prisma.calificacion.aggregate({
            where : { id_cliente: clienteId, calificador_es_cliente: false}, 
            _avg: { puntuacion : true}
        }); 

        return resultado._avg.puntuacion ?? null; 
    }
    
}