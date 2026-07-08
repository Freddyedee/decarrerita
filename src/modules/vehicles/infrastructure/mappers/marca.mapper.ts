import { Marca } from "../../domain/entities/Marca";
import {marca as PrismaMarca} from "@prisma/client"

export class marcaMapper {

     static toDomain(raw: PrismaMarca): Marca {
        return new Marca(raw.id_marca, raw.nombre, raw.descripcion);
    }

    static toPersistence(marca : Marca){ 
        return {
            id_marca: marca.id, 
            nombre: marca.nombre, 
            descripcion: marca.descripcion
        }; 
    }


}
