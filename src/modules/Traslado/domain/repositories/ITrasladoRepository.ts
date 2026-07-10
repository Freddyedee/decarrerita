import { Prisma } from "@prisma/client";
import { Traslado } from "../entities/Traslado";

export interface ITrasladoRepository {

    create (traslado: Traslado): Promise<Traslado>; 

    findById(id: number): Promise <Traslado | null>; 

    
    findByClienteId(clienteId: number): Promise<Traslado[]>; 

    findByChoferId(choferId: number): Promise<Traslado[]>; 


    /**
     * 
     * El segundo parametro es opcionaal : si se provee, la
     * escritura ocurre dentro de esa transaccion, si se omite, 
     * se ejecuta de forma independiente. 
     * 
    */
   
   /**
    * Agregar el parametro Tx?: Prisma.TransactionClient permitimos que el repositorio sea polimorfico con respecto a quien controla la conexión
    * 
    * si tx es undefined : El repositorio usa su cliente de base de ddatos estandar 
    * 
    * si tx se provee: El repositorio deja su propia conexion y utilizan laque le suministran desde afuera. Esta accion encadena la operacion de este respositorio 
    * a la transaccion global que se esta ocurriendo en el caso de uso
    * 
    */

    update(traslado : Traslado, tx?: Prisma.TransactionClient): Promise<Traslado>; 

    
   /** Traslados realizados dentro de un rango de fechas,
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