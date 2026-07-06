import { NextRequest, NextResponse } from "next/server";

import { GetVehicleByIdUseCase } from "@/modules/vehicles/application/use-cases/GetVehicleByIdUseCase";
import { UpdateVehicleStatusUseCase } from "@/modules/vehicles/application/use-cases/UpdateVehicleStatusUseCase";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repository = new VehicleRepository();
    const useCase = new GetVehicleByIdUseCase(repository);

    const vehicle = await useCase.execute(Number(params.id));

    return NextResponse.json(
      { message: "Vehicle retrieved successfully", data: vehicle },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error retrieving vehicle",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json(); // { status: "activo" | "inactivo" | "en_revision" | "mantenimiento" }

    const repository = new VehicleRepository();
    const useCase = new UpdateVehicleStatusUseCase(repository);

    const vehicle = await useCase.execute(Number(params.id), body.status);

    return NextResponse.json(
      { message: "Vehicle status updated successfully", data: vehicle },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error updating vehicle status",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}