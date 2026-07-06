import { CreateVehicleDTO } from "../application/dto/create-vehicle-dto";
import { CreateVehicleUseCase } from "../application/use-cases/createVehicleUseCase";
import { GetAllVehiclesUseCase } from "../application/use-cases/GetAllVehiclesUseCase";

export class VehicleController {

    constructor(
        private readonly createVehicleUseCase: CreateVehicleUseCase,
        private readonly getAllVehiclesUseCase?: GetAllVehiclesUseCase
    ) {}

    async create(body: CreateVehicleDTO) {
        return this.createVehicleUseCase.execute(body);
    }

    async getAll() {
        return this.getAllVehiclesUseCase!.execute();
    }
}