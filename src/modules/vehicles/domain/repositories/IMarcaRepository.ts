import { Marca } from "../entities/Marca";

export interface IMarcaRepository { 

    create (marca : Marca): Promise <Marca>; 

    findAll(): Promise<Marca[]>; 

    findById(id: number): Promise <Marca | null>; 
    
    findByNombre (nombre: string): Promise< Marca | null>;  

}