import { prisma } from "@/shared/lib/prisma";
import { Marca } from "../../domain/entities/Marca";
import { IMarcaRepository } from "../../domain/repositories/IMarcaRepository";
import { marcaMapper } from "../mappers/marca.mapper";

export class MarcaRepository implements IMarcaRepository { 

    async create(marca:Marca): Promise <Marca> { 

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id_marca: _id_marca, ...data} = marcaMapper.toPersistence(marca); 
        
        const created = await prisma.marca.create({data}); 

        return marcaMapper.toDomain(created); 
    }

    async findAll(): Promise <Marca[]> { 

        const marcas = await prisma.marca.findMany ({
            orderBy: {nombre : "asc"}
        }); 

        return marcas.map (m => marcaMapper.toDomain(m)); 
    }

    async findById(id: number): Promise <Marca | null> {

        const marca = await prisma.marca.findUnique ({where: {id_marca: id}}); 
    
        return marca ? marcaMapper.toDomain(marca) : null ; 
    }

    async findByNombre(nombre: string): Promise<Marca | null> {

        const marca = await prisma.marca.findUnique({
            where: { nombre }
        });

        return marca ? marcaMapper.toDomain(marca) : null;
    }


}