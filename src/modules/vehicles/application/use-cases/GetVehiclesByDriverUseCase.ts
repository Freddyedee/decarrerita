import { VehicleResponseDTO } from "../dto/VehicleResponseDTO";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { VehicleResponseMapper } from "../mappers/vehicle-response.mapper";

export class GetVehiclesByDriverUseCase {

    constructor ( private readonly vehicleRepository: IVehicleRepository){}

    async execute  (driverId : number): Promise <VehicleResponseDTO[]> {

        const vehicles = await this.vehicleRepository.findByDriverId(driverId); 


        return vehicles.map(vehicle => VehicleResponseMapper.toDTO(vehicle))

    }

}