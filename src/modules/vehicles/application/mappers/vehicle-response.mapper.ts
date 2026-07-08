import { Vehicle } from "../../domain/entities/Vehicle";
import { VehicleResponseDTO } from "../dto/VehicleResponseDTO";

/**
 * Mapper responsable de convertir una Entity Vehicle
 * en un DTO que será enviado al cliente.
 *
 * Este mapper pertenece a la capa de Aplicación,
 * ya que adapta objetos del dominio al contrato
 * de salida del sistema.
 */
export class VehicleResponseMapper {

    /**
     * Convierte una Entity Vehicle en un VehicleResponseDTO.
     *
     * @param vehicle Entidad del dominio.
     * @returns DTO listo para ser enviado al frontend.
     */
    static toDTO(vehicle: Vehicle): VehicleResponseDTO {

        return {

            id: vehicle.id,

            brandId: vehicle.brandId,

            driverId: vehicle.driverId,

            plate: vehicle.plate,

            model: vehicle.model,

            color: vehicle.color,

            year: vehicle.year,

            passengerCapacity: vehicle.passengerCapacity,

            status: vehicle.status,

            createdAt: vehicle.createdAt

        };

    }

}