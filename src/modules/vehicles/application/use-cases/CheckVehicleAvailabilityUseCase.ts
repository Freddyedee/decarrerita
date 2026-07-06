import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";

export class CheckVehicleAvailabilityUseCase {


    constructor (private readonly vehicleRepository: IVehicleRepository){}

    async execute (vehicleId: number): Promise <boolean> {

        const vehicle = await this.vehicleRepository.findById(vehicleId); 

        if(!vehicle){
            throw new Error ('Vehicle with id ${vehicleId} not found');
        }
        
        //regla definida en la entity. 
        return vehicle.isAvailable(); 

    }
}