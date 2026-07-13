import {prisma} from "@/shared/lib/prisma";

import { AsignacionChofer } from "../../domain/entities/AsignacionChofer";
import { EstadoRespuesta } from "../../domain/Enum/EstadoRespuesta";
import { IAsignacionRepository } from "../../domain/repositories/IAsignacionRepository";


export class AsignacionRepository implements IAsignacionRepository{

    async createBatch(asignaciones: AsignacionChofer[]): Promise<AsignacionChofer[]>{

        const data = asignaciones.map(a => ({
            id_traslado: a.trasladoId,
            id_chofer: a.choferId, 
            prioridad: a.prioridad, 
            estado_respuesta: a.estadoRespuesta
        }));

        await prisma.asignacion_chofer.createMany({ data}); 

        // createMany no devuelve las filas creadas en Postgres,
        // así que las recuperamos con una segunda consulta.

        return this.findByTrasladoId(asignaciones[0].trasladoId); 
    }

    async findById(id: number): Promise<AsignacionChofer | null>{

        const a = await prisma.asignacion_chofer.findUnique( { where: { id_asignacion: id}}); 

        if(!a) return null; 
        

        return new AsignacionChofer(a.id_asignacion, a.id_traslado, a.id_chofer, a.prioridad, a.estado_respuesta as EstadoRespuesta);
    }

    async findByTrasladoId(trasladoId: number): Promise<AsignacionChofer[]> {
        const list = await prisma.asignacion_chofer.findMany({
            where: { id_traslado: trasladoId },
            orderBy: { prioridad: "asc" }
        });
        return list.map(a => new AsignacionChofer(a.id_asignacion, a.id_traslado, a.id_chofer, a.prioridad, a.estado_respuesta as EstadoRespuesta));
    }

    async update(asignacion: AsignacionChofer): Promise<AsignacionChofer> {
        const updated = await prisma.asignacion_chofer.update({
            where: { id_asignacion: asignacion.id },
            data: { estado_respuesta: asignacion.estadoRespuesta }
        });
        return new AsignacionChofer(updated.id_asignacion, updated.id_traslado, updated.id_chofer, updated.prioridad, updated.estado_respuesta as EstadoRespuesta);
    }

    async findSiguientePendiente(trasladoId: number): Promise<AsignacionChofer | null> {
        const a = await prisma.asignacion_chofer.findFirst({
            where: { id_traslado: trasladoId, estado_respuesta: EstadoRespuesta.PENDIENTE },
            orderBy: { prioridad: "asc" }
        });
        if (!a) return null;
        return new AsignacionChofer(a.id_asignacion, a.id_traslado, a.id_chofer, a.prioridad, a.estado_respuesta as EstadoRespuesta);
    }

    /**
     * Pieza clave de atomicidad: updateMany con el estado
     * esperado (PENDIENTE) como parte del WHERE. Postgres
     * serializa automáticamente peticiones concurrentes —
     * solo una puede tener count === 1; cualquier otra que
     * llegue después ya no encuentra la fila en PENDIENTE.
     */

     async aceptarSiSigueDisponible(asignacionId: number): Promise<boolean> {
        const resultado = await prisma.asignacion_chofer.updateMany({
            where: { id_asignacion: asignacionId, estado_respuesta: EstadoRespuesta.PENDIENTE },
            data: { estado_respuesta: EstadoRespuesta.ACEPTADO }
        });
        return resultado.count === 1;
    }

    async cerrarOfertasRestantes(trasladoId: number, asignacionGanadoraId: number): Promise<void> {
        await prisma.asignacion_chofer.updateMany({
            where: {
                id_traslado: trasladoId,
                id_asignacion: { not: asignacionGanadoraId },
                estado_respuesta: EstadoRespuesta.PENDIENTE
            },
            data: { estado_respuesta: EstadoRespuesta.RECHAZADO }
        });
    }

}
