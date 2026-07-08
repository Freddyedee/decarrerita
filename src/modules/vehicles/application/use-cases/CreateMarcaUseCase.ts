import { CreateMarcaDTO } from "../dto/create-marca-dto";
import { Marca } from "../../domain/entities/Marca";
import { IMarcaRepository } from "../../domain/repositories/IMarcaRepository";

export class CreateMarcaUseCase {

    constructor(private readonly marcaRepository: IMarcaRepository){}

    async execute(input: CreateMarcaDTO): Promise <Marca> {

        if(!input.nombre || input.nombre.trim().length === 0 ){
            throw new Error("Marca name is required."); 
        }


        //Regla: Evitar duplicados por difernecias de mayusculas o minisculas. 

        const existing = await this.marcaRepository.findByNombre(input.nombre.trim());

        if(existing){
            throw new Error('Marca "${input.nombre}" already exists. ');
        }

        const marca = new Marca(0, input.nombre.trim(), input.descripcion?? null); 

        return this.marcaRepository.create(marca); 
    }

}
