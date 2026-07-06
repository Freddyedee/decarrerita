import { VehicleResponseDTO } from "../dto/VehicleResponseDTO";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { VehicleResponseMapper } from "../mappers/vehicle-response.mapper";

export class GetVehicleByIdUseCase {

    constructor(private readonly vehicleRepository: IVehicleRepository) {}

    async execute (id: number): Promise<VehicleResponseDTO> {

        const vehicle = await this.vehicleRepository.findById(id); 

        if(!vehicle){ throw new Error ('Vehicle with id ${id} not found')}; 

        return VehicleResponseMapper.toDTO(vehicle); 
    }

}