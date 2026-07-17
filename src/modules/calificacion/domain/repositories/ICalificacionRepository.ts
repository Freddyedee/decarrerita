import { Calificacion } from "../Calificacion";

export interface ICalificacionRepository { 

    create (calificacion: Calificacion): Promise <Calificacion>; 

    findByTrasladoId(trasladoId: number): Promise <Calificacion[]>

    promedioByChoferId (choferId: number): Promise <number | null>

    promedioByClienteId (clienteId: number): Promise <number | null>
}