// application/use-cases/SelectVehicleUseCase.ts

import { Vehicle } from "../../domain/entities/Vehicle";
import { VehicleStatus } from "../../domain/enum/VehicleStatus";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IRevisionRepository } from "../../domain/repositories/IRevisionVehicular";

export class SelectVehicleUseCase {

    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly revisionRepository: IRevisionRepository
    ) {}

    async execute(vehicleId: number, driverId: number): Promise<Vehicle> {

        const vehicle = await this.vehicleRepository.findById(vehicleId);

        if (!vehicle) {
            throw new Error(`Vehicle with id ${vehicleId} not found`);
        }

        if (vehicle.driverId !== driverId) {
            throw new Error("This vehicle does not belong to the specified driver");
        }

        // La aptitud técnica se verifica aquí, en el momento
        // en que realmente importa: cuando se intenta seleccionar.
        const latestRevision = await this.revisionRepository.findLatestByVehicleId(vehicleId);

        if (!latestRevision || !latestRevision.isValid()) {
            throw new Error(
                "Vehicle must have a valid, non-expired technical inspection before it can be selected"
            );
        }

        // Solo puede haber un vehículo ACTIVE por chofer.
        // Desactivamos cualquier otro que estuviera activo.
        const driverVehicles = await this.vehicleRepository.findByDriverId(driverId);

        for (const other of driverVehicles) {
            if (other.id !== vehicle.id && other.status === VehicleStatus.ACTIVE) {
                other.desactivate();
                await this.vehicleRepository.update(other);
            }
        }

        vehicle.activate();
        return this.vehicleRepository.update(vehicle);
    }
}