import { Vehicle } from "../../domain/Vehicle";
import { VehicleStatus } from "../../domain/VehicleStatus";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { CreateVehicleDTO } from "../dto/create-vehicle-dto";

export class CreateVehicleUseCase {

  constructor(
    private readonly vehicleRepository: IVehicleRepository
  ) {}

  async execute(input: CreateVehicleDTO) {

    //  1. VALIDACIÓN: campos obligatorios
    if (
      !input.plate ||
      !input.model ||
      !input.color
    ) {
      throw new Error("Missing required vehicle fields");
    }

    //  2. VALIDACIÓN: año lógico
    const currentYear = new Date().getFullYear();

    if (input.year < 1990 || input.year > currentYear + 1) {
      throw new Error("Invalid vehicle year");
    }

    //  3. VALIDACIÓN: capacidad lógica
    if (input.passengerCapacity <= 0 || input.passengerCapacity > 8) {
      throw new Error("Invalid passenger capacity");
    }

    //  4. VALIDACIÓN CRÍTICA: placa única
    const existingVehicle = await this.vehicleRepository.findByPlate(input.plate);

    if (existingVehicle) {
      throw new Error("Vehicle with this plate already exists");
    }

    //  5. CREACIÓN DE ENTIDAD DE DOMINIO
    const vehicle = new Vehicle(
      0,
      input.brandId,
      input.driverId,
      input.plate,
      input.model,
      input.color,
      input.year,
      input.passengerCapacity,
      new Date(),
      VehicleStatus.ACTIVE
    );

    //  6. PERSISTENCIA
    const savedVehicle = await this.vehicleRepository.create(vehicle);

    //  7. RESPUESTA FINAL
    return savedVehicle;
  }
}