import { VehicleResponseDTO } from "../dto/VehicleResponseDTO";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { VehicleResponseMapper } from "../mappers/vehicle-response.mapper";
import { VehicleStatus } from "../../domain/enum/VehicleStatus";

export class UpdateVehicleStatusUseCase { 

    constructor (private readonly vehicleRepository: IVehicleRepository) {}

    async execute (id: number, newStatus: VehicleStatus): Promise <VehicleResponseDTO>{


        if (newStatus === VehicleStatus.ACTIVE) {
            throw new Error(
                "Cannot activate a vehicle directly. Use the vehicle selection flow instead."
            );
        }

    const vehicle = await this.vehicleRepository.findById(id); 

    if(!vehicle) { throw new Error ('Vehicle with id ${id} not found'); } 



    switch (newStatus) {
            case VehicleStatus.INACTIVE:
                vehicle.desactivate();
                break;
            case VehicleStatus.REVISION:
                vehicle.senRevision();
                break;
            case VehicleStatus.MAINTENANCE:
                vehicle.sendToMaintenance();
                break;
            default:
                throw new Error(`Invalid status: ${newStatus}`);
        }

         const updated = await this.vehicleRepository.update(vehicle);

        return VehicleResponseMapper.toDTO(updated);

    }

}