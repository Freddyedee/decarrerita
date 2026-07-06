import { NextRequest, NextResponse } from "next/server";

import { GetVehiclesByDriverUseCase } from "@/modules/vehicles/application/use-cases/GetVehiclesByDriverUseCase";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";

export async function GET(
  req: NextRequest,
  { params }: { params: { driverId: string } }
) {
  try {
    const repository = new VehicleRepository();
    const useCase = new GetVehiclesByDriverUseCase(repository);

    const vehicles = await useCase.execute(Number(params.driverId));

    return NextResponse.json(
      { message: "Vehicles retrieved successfully", data: vehicles },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error retrieving vehicles",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}