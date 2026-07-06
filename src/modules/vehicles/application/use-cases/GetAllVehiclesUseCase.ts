/* Unica responsabilidad: Obtener todos los vehiculos registrados*/

import { VehicleResponseDTO } from "../dto/VehicleResponseDTO";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { VehicleResponseMapper } from "../mappers/vehicle-response.mapper";

/**
 * Caso de uso encargado de consultar
 * todos los vehículos registrados.
 *
 * Responsabilidades:
 *
 * 1. Solicitar los vehículos al repositorio.
 * 2. Transformar las entidades del dominio
 *    en DTOs de salida.
 * 3. Devolver la información lista para el Controller.
 *
 * Este caso de uso NO conoce Prisma,
 * NO conoce Express,
 * NO conoce PostgreSQL.
 */

export class GetAllVehiclesUseCase {

    constructor(

        private readonly vehicleRepository: IVehicleRepository

    ) {}

    /**
     * Ejecuta el caso de uso.
     */
    async execute(): Promise<VehicleResponseDTO[]> {

        /**
         * Obtenemos las entidades
         * desde el repositorio.
         */
        const vehicles = await this.vehicleRepository.findAll();

        /**
         * Transformamos cada Entity
         * en un DTO de respuesta.
         */
        return vehicles.map(vehicle =>

            VehicleResponseMapper.toDTO(vehicle)

        );

    }

}