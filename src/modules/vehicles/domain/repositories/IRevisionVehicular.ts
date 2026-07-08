import { RevisionVehicular } from "../entities/RevisionVehicular";

/** 
 * Puerto (Port) para la persistencia de revisiones vehiculares
 * Ningun caso de uso concoce prisma a esta altura. 
 * 
 */

export interface IRevisionRepository {

    /**
     * Registra una nueva revision vehicular.
     */

    create(revision: RevisionVehicular): Promise<RevisionVehicular>

     /**
     * Busca una revisión por su identificador.
     */
    findById(id: number): Promise<RevisionVehicular | null>;

    /**
     * Obtiene todas las revisiones de un vehículo,
     * de la más reciente a la más antigua.
     *
     * Esto es lo que alimenta el "Historial" que
     * pide el planteamiento del problema.
     */
    findByVehicleId(vehicleId: number): Promise<RevisionVehicular[]>;

    /**
     * Obtiene la revisión más reciente de un vehículo.
     *
     * Es la que determina si el vehículo está
     * actualmente apto o no.
     */
    findLatestByVehicleId(vehicleId: number): Promise<RevisionVehicular | null>;
}
