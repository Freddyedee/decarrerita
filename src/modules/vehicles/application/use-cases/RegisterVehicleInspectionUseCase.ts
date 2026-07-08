import { CreateRevisionDTO } from "../dto/create-revision";
import { RevisionVehicular } from "../../domain/entities/RevisionVehicular";
import { IRevisionRepository } from "../../domain/repositories/IRevisionVehicular";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { VehicleStatus } from "../../domain/enum/VehicleStatus";


export class RegisterVehicleInspectionsUseCase {

    constructor (private readonly revisionRepository: IRevisionRepository, private readonly vehicleRepository: IVehicleRepository){}

    //1: VALIDACION: Vehiculo debe existir

    async execute (input: CreateRevisionDTO): Promise <RevisionVehicular>{

        //1. Validacion: Vehiculo debe existir. 
        const vehicle = await this.vehicleRepository.findById(input.vehicleId); 

        if(!vehicle){
            throw new Error ('Vehicle with id ${input.vehicleId} not found');
        }

        //2. validacion:  calificación dentro de rango (0- 100) 
        if(input.score < 0 || input.score > 100){
            throw new Error ('Invalid inspection score: must be between 0 and 100');
        }

        //3. Construccion de la Entity: La fecha de vencimiento, no la decide administrativo se calcula. 

        const revisionDate = input.date ?? new Date(); 
        const expirationDate = RevisionVehicular.calculateExpirationDate(revisionDate); 

        const revision = new RevisionVehicular (
            0, // placeholder, el id real la asigna la BD 
            input.vehicleId, 
            input.score, 
            revisionDate,
            input.observations, 
            expirationDate
        ); 

        //4. Perisistencia de la revision 

        const savedRevision = await this.revisionRepository.create(revision); 

        // 5. EFECTO EN EL VEHÍCULO: el resultado de la revisión
        //    determina si el vehículo queda activo o no.
        //    Cada Entity solo conoce sus propias reglas;
        //    este UseCase es quien las coordina.

        if (vehicle.status !== VehicleStatus.MAINTENANCE) {
        vehicle.desactivate(); // pasa a INACTIVE: ya fue evaluado, pendiente de selección
}

        await this.vehicleRepository.update(vehicle); 

        return savedRevision; 


    }
    




    }





