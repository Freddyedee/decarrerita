import { Prisma } from "@prisma/client";

export interface ITransactionManager {

    /**
     * 
     * Ejecuta el callback dentro de una transacion real de Postgress. 
     * Sí el callback lanza cualquier error, todos los cambios se revierten automaticamente
     * 
     */

    run<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>; 

}