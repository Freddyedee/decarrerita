import { Traslado } from "../entities/Traslado";

export interface ITrasladoRepository {

    create (traslado: Traslado): Promise<Traslado>; 

    findById(id: number): Promise <Traslado | null>; 

    update(traslado : Traslado): Promise<Traslado>; 

    findByClienteId(clienteId: number): Promise<Traslado[]>; 

    findByChoferId(choferId: number): Promise<Traslado[]>; 


       /**
     * Traslados realizados dentro de un rango de fechas,
     * para los reportes que pide el planteamiento del problema.
     */
    findByRangoFechas(desde: Date, hasta: Date): Promise<Traslado[]>;

    /**
     * Verifica si un chofer tiene actualmente un traslado
     * EN_CURSO — necesario para excluirlo de nuevas ofertas
     * mientras ya está ocupado.
     */
    hasChoferTrasladoEnCurso(choferId: number): Promise<boolean>;

}