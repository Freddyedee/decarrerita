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

    async findById(id: number): Promise<any | null> {
        const traslado = await prisma.traslado.findUnique({
            where: { id_traslado: id },
            include: {
                chofer: {
                    include: {
                        usuario: {
                            select: { nombre: true, apellido: true, telefono: true, email: true }
                        }
                    }
                },
                cliente: {
                    include: {
                        usuario: {
                            select: { nombre: true, apellido: true, telefono: true, email: true }
                        }
                    }
                },
                vehiculo: {
                    include: {
                        marca: {
                            select: { nombre: true }
                        }
                    }
                },
                tarifa: true,
                calificacion: true
            }
        }); 

        if (!traslado) return null;

        // 1. Convertimos el JSON plano de Prisma a tu Entidad de Dominio
        // (Esto restaura los métodos de negocio como .iniciar() o .completar())
        const domainEntity = trasladoMapper.toDomain(traslado);

        // 2. Le adjuntamos las relaciones anidadas al objeto de dominio
        // (Así el UseCase puede usar .iniciar() y el frontend recibe el chofer y el vehículo)
        return Object.assign(domainEntity, {
            chofer: traslado.chofer,
            cliente: traslado.cliente,
            vehiculo: traslado.vehiculo,
            tarifa: traslado.tarifa,
            calificacion: traslado.calificacion
        });
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

    async findAllWithDetails(): Promise<any[]> {
        const traslados = await prisma.traslado.findMany({
            include: {
                cliente: {
                    select: {
                        id_usuario: true,
                        rating_promedio: true, // <--- En cliente sí se llama rating_promedio 
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                                telefono: true,
                                email: true
                            }
                        }
                    }
                },
                chofer: {
                    select: {
                        id_usuario: true,
                        licencia: true,
                        puntaje_promedio: true, // <--- CORREGIDO: En chofer se llama puntaje_promedio 
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                                telefono: true,
                                email: true
                            }
                        }
                    }
                },
                vehiculo: {
                    select: {
                        placa: true,
                        modelo: true,
                        color: true
                    }
                },
                calificacion: true
            },
            orderBy: { 
                fecha_solicitud: "desc" 
            }
        });

        return traslados;
    }

    async findByClienteId(clienteId: number): Promise<any[]> {
        const traslados = await prisma.traslado.findMany({
            where: { 
                id_cliente: clienteId 
            },
            include: {
                chofer: {
                    select: {
                        id_usuario: true,
                        licencia: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                                telefono: true
                            }
                        }
                    }
                },
                vehiculo: {
                    select: {
                        placa: true,
                        modelo: true,
                        color: true
                    }
                },
                calificacion: true
            },
            orderBy: { 
                fecha_solicitud: "desc" 
            }
        });

        return traslados;
    }

    async findByChoferId(choferId: number): Promise<any[]> {
        const traslados = await prisma.traslado.findMany({
            where: { 
                id_chofer: choferId 
            },
            include: {
                // CORRECCIÓN: Entramos a la relación "usuario" dentro de "cliente"
                cliente: {
                    select: {
                        id_usuario: true,
                        rating_promedio: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                                telefono: true
                            }
                        }
                    }
                },
                vehiculo: {
                    select: {
                        placa: true,
                        modelo: true,
                        color: true
                    }
                },
                calificacion: true
            },
            orderBy: { 
                fecha_solicitud: "desc" 
            }
        });

        return traslados;
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


    async getTrasladosPorChoferYEstado(
        choferId: number, 
        estados: string[], 
        desde: Date, 
        hasta: Date
    ): Promise<any[]> {
        
        // Prevención de errores SQL: Si no hay estados, retornamos un arreglo vacío
        if (!estados || estados.length === 0) {
            return [];
        }

        // Prisma.join() es vital aquí: descompone el arreglo de strings en 
        // una lista segura separada por comas para la cláusula IN (...), 
        // evitando inyecciones SQL.
        const resultado = await prisma.$queryRaw<any[]>`
            SELECT 
                t.id_traslado,
                t.fecha_solicitud,
                t.origen_latitud,
                t.origen_longitud,
                t.destino_latitud,
                t.destino_longitud,
                t.distancia_estimada_km,
                t.costo_estimado,
                t.estado_actual
            FROM 
                traslado t
            WHERE 
                t.id_chofer = ${choferId}
                AND t.estado_actual IN (${Prisma.join(estados)})
                AND t.fecha_solicitud >= ${desde}
                AND t.fecha_solicitud <= ${hasta}
            ORDER BY 
                t.fecha_solicitud DESC;
        `;

        return resultado;
    }
}