import { NextRequest, NextResponse } from "next/server";

import { VehicleController } from "@/modules/vehicles/presentation/vehicle.controller";
import { CreateVehicleUseCase } from "@/modules/vehicles/application/use-cases/createVehicleUseCase";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";
import { CreateVehicleDTO } from "@/modules/vehicles/application/dto/create-vehicle-dto";

export async function POST(req: NextRequest) {

  try {

    const raw = await req.json();

    // 🔢 Normalización de tipos: HTTP/JSON puede entregar strings,
    // pero el dominio espera números. Esta conversión pertenece
    // aquí, no al UseCase ni al Controller.
    const body: CreateVehicleDTO = {
      brandId: Number(raw.brandId),
      driverId: Number(raw.driverId),
      plate: raw.plate,
      model: raw.model,
      color: raw.color,
      year: Number(raw.year),
      passengerCapacity: Number(raw.passengerCapacity)
    };

    const repository = new VehicleRepository();
    const useCase = new CreateVehicleUseCase(repository);
    const controller = new VehicleController(useCase);

    const result = await controller.create(body);

    return NextResponse.json(
      { message: "Vehicle created successfully", data: result },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating vehicle",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}