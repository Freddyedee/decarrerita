import { NextRequest, NextResponse } from "next/server";
import { vehicleController } from "@/modules/vehicles/presentation/vehicle.modules";

export async function POST(
  request: NextRequest, { params }: { params: Promise<{ id : string}> }
) {
  try {

    const { id } = await params; 
    const body = await request.json(); // { driverId: number }

    const vehicle = await vehicleController.select(
      Number(id),
      Number(body.driverId)
    );

    return NextResponse.json(
      { message: "Vehicle selected successfully", data: vehicle },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error selecting vehicle", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}