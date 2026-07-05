import { CreateVehicleUseCase } from "../application/create-vehicle";
import { CreateVehicleDTO } from "../application/dto/create-vehicle-dto";

export class VehicleController {

  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase
  ) {}

    async create(data: CreateVehicleDTO) {

    const vehicle = await this.createVehicleUseCase.execute(data);
    return vehicle;
  }
}