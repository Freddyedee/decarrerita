import { prisma } from "@shared/lib/prisma";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";

export class HistorialTrasladoRepository implements IHistorialTrasladoRepository {

    async registrarCambio(trasladoId: number, estadoAnterior: string, estadoNuevo: string, observacion?: string): Promise<void> {
        
        await prisma.historial_estado_traslado.create({
            data:{
                id_traslado: trasladoId, 
                estado_anterior: estadoAnterior, 
                estado_nuevo: estadoNuevo, 
                observacion: observacion ?? null
            }
        });
    }
}