import { NextRequest, NextResponse } from "next/server";
import { vehicleController } from "@/modules/vehicles/presentation/vehicle.modules";


export async function GET(
  request: Request,
  context: { params: Promise<{ driverId: string }> } // Promesa con driverId
) {

  try {
    const params = await context.params; // Desempaquetamos
    
    // Usamos params.driverId desempaquetado
    const vehicles = await vehicleController.getByDriver(Number(params.driverId)); 
    
    return NextResponse.json(
      { message: "Vehicles retrieved successfully", data: vehicles }, 
      { status: 200 }
    );

  } catch (error) {
    
    return NextResponse.json(
      { message: "Error retrieving vehicles", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}