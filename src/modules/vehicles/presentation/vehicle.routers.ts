import { NextRequest, NextResponse } from "next/server";
import { CreateVehicleDTO } from "@/modules/vehicles/application/dto/create-vehicle-dto";
import { vehicleController } from "./vehicle.modules";

export async function POST(req: NextRequest) {

  try {

    const raw = await req.json();

    // Normalización de tipos: HTTP/JSON puede entregar strings,
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

    const result = await vehicleController.create(body);

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

export async function GET() {
  try {
    const result = await vehicleController.getAll();
    return NextResponse.json(
      { message: "Vehicles retrieved successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving vehicles", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}