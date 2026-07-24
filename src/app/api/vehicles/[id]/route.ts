import { NextRequest, NextResponse } from "next/server";

import { GetVehicleByIdUseCase } from "@/modules/vehicles/application/use-cases/GetVehicleByIdUseCase";
import { UpdateVehicleStatusUseCase } from "@/modules/vehicles/application/use-cases/UpdateVehicleStatusUseCase";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";

export async function GET(
  request: NextRequest, { params }: { params: Promise<{ id : string}> }
) {
  try {

    const { id} = await params; 
    const repository = new VehicleRepository();
    const useCase = new GetVehicleByIdUseCase(repository);

    const vehicle = await useCase.execute(Number(id));

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
    request: NextRequest, { params }: { params: Promise<{ id : string}> }

) {
  try {
    const body = await request.json(); // { status: "activo" | "inactivo" | "en_revision" | "mantenimiento" }
    const { id} = await params; 
    const repository = new VehicleRepository();
    const useCase = new UpdateVehicleStatusUseCase(repository);

    const vehicle = await useCase.execute(Number(id), body.status);

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