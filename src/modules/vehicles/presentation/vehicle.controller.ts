// vehicle.controller.ts

import { CreateVehicleDTO } from "../application/dto/create-vehicle-dto";
import { CreateVehicleUseCase } from "../application/use-cases/createVehicleUseCase";
import { GetAllVehiclesUseCase } from "../application/use-cases/GetAllVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../application/use-cases/GetVehicleByIdUseCase";
import { UpdateVehicleStatusUseCase } from "../application/use-cases/UpdateVehicleStatusUseCase";
import { GetVehiclesByDriverUseCase } from "../application/use-cases/GetVehiclesByDriverUseCase";
import { SelectVehicleUseCase } from "../application/use-cases/SelectVehicleUseCase";
import { VehicleStatus } from "../domain/enum/VehicleStatus";
import { GetVehiculosPorVencerUseCase } from "../application/use-cases/GetVehiculosPorVencerUseCase";

export class VehicleController {

    constructor(
        private readonly createVehicleUseCase: CreateVehicleUseCase,
        private readonly getAllVehiclesUseCase: GetAllVehiclesUseCase,
        private readonly getVehicleByIdUseCase: GetVehicleByIdUseCase,
        private readonly updateVehicleStatusUseCase: UpdateVehicleStatusUseCase,
        private readonly getVehiclesByDriverUseCase: GetVehiclesByDriverUseCase, 
        private readonly selectVehicleUseCase: SelectVehicleUseCase,
        private readonly getVehiculosPorVencerUseCase: GetVehiculosPorVencerUseCase
    ) {}

    async create(body: CreateVehicleDTO) {
        return this.createVehicleUseCase.execute(body);
    }

    async getAll() {
        return this.getAllVehiclesUseCase.execute();
    }

    async getById(id: number) {
        return this.getVehicleByIdUseCase.execute(id);
    }

    async updateStatus(id: number, status: VehicleStatus) {
        return this.updateVehicleStatusUseCase.execute(id, status);
    }

    async getByDriver(driverId: number) {
        return this.getVehiclesByDriverUseCase.execute(driverId);
    }

    async select(vehicleId: number, driverId: number){
        return this.selectVehicleUseCase.execute(vehicleId, driverId); 
    }

    async getVencimientos() {
    return this.getVehiculosPorVencerUseCase.execute();
}
}