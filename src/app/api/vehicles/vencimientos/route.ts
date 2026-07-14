// src/app/api/vehicles/vencimientos/route.ts

import { NextResponse } from "next/server";
import { vehicleController } from "@/modules/vehicles/presentation/vehicle.modules";

export async function GET() {
  try {
    const data = await vehicleController.getVencimientos();
    return NextResponse.json({ message: "Vencimientos retrieved successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving vencimientos", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}