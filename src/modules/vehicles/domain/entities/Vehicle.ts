import { VehicleStatus } from "../enum/VehicleStatus";


export class Vehicle {

    constructor(

        public readonly id: number, 
        public readonly brandId: number, 
        public readonly driverId: number, 
        public readonly plate: string, 
        public readonly model: string, 
        public readonly color: string, 
        public readonly year: number, 
        public readonly passengerCapacity: number, 
        public readonly createdAt: Date,
        public status: VehicleStatus

    ){}

    //Metodos/Reglas (con base en las acciones al vehiculo) de negocio principales. 

    desactivate()       { this.status = VehicleStatus.INACTIVE}
    
    activate()          { this.status = VehicleStatus.ACTIVE}
    
    senRevision()       { this.status = VehicleStatus.REVISION}
    
    sendToMaintenance() { this.status = VehicleStatus.MAINTENANCE}

    isAvailable() : boolean { return this.status === VehicleStatus.ACTIVE}

}