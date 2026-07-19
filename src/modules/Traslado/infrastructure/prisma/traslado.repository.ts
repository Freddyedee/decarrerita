import { Prisma} from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

import { Traslado } from "../../domain/entities/Traslado";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";
import { trasladoMapper } from "./traslado.mapper";

//Capa de persistencia, puente entre la logica de negocio y base de datos. 
export class TrasladoRepository implements TrasladoRepository{

    async create(traslado: Traslado): Promise<Traslado> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id_traslado: _id_traslado, ...data } = trasladoMapper.toPersistence(traslado);
        const created = await prisma.traslado.create({ data });
        return trasladoMapper.toDomain(created);
    }

    async findById(id:number): Promise<Traslado | null>{
        const traslado = await prisma.traslado.findUnique ({where: { id_traslado : id}}); 
        return traslado ? trasladoMapper.toDomain(traslado) : null; 
    }

    async update(traslado: Traslado, tx?: Prisma.TransactionClient): Promise<Traslado>{

        const client = tx ?? prisma; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id_traslado: _id_traslado, ...data} = trasladoMapper.toPersistence(traslado); 
        const updated = await client.traslado.update ({
            where: { id_traslado: traslado.id},
            data
        }); 

        return trasladoMapper.toDomain(updated); 
    }

     async findByClienteId(clienteId: number): Promise<Traslado[]> {
        const traslados = await prisma.traslado.findMany({
            where: { id_cliente: clienteId },
            orderBy: { fecha_solicitud: "desc" }
        });
        return traslados.map(t => trasladoMapper.toDomain(t));
    }

    async findByChoferId(choferId: number): Promise<Traslado[]> {
        const traslados = await prisma.traslado.findMany({
            where: { id_chofer: choferId },
            orderBy: { fecha_solicitud: "desc" }
        });
        return traslados.map(t=> trasladoMapper.toDomain(t));
    }

    async findByRangoFechas(desde: Date, hasta: Date): Promise<Traslado[]> {
        const traslados = await prisma.traslado.findMany({
            where: { fecha_solicitud: { gte: desde, lte: hasta } },
            orderBy: { fecha_solicitud: "desc" }
        });
        return traslados.map(t=> trasladoMapper.toDomain(t));
    }

    async hasChoferTrasladoEnCurso(choferId: number): Promise<boolean> {
        const count = await prisma.traslado.count({
            where: { id_chofer: choferId, estado_actual: EstadoTraslado.EN_CURSO }
        });
        return count > 0;
    }

}