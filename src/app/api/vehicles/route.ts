import { NextRequest, NextResponse } from "next/server";
import { vehicleController } from "@/modules/vehicles/presentation/vehicle.modules";
import { CreateVehicleDTO } from "@/modules/vehicles/application/dto/create-vehicle-dto";

export async function POST(req: NextRequest) {

  
  try {
    console.log("🚩 [VEHÍCULOS] PASO 1: Entrando a POST /api/vehicles");
    
    // Convertimos request HTTP a objeto plano
    const raw = await req.json();

    console.log("🚩 [VEHÍCULOS] PASO 2: Body recibido del frontend:", raw);

    const body: CreateVehicleDTO = {
      brandId: Number(raw.brandId),
      driverId: Number(raw.driverId),
      plate: raw.plate,
      model: raw.model,
      color: raw.color,
      year: Number(raw.year),
      passengerCapacity: Number(raw.passengerCapacity)
    };

    // Ejecutamos lógica del dominio
    const result = await vehicleController.create(body);

    console.log("🚩 [VEHÍCULOS] PASO 3: Vehículo creado exitosamente");

    // Respuesta HTTP (único lugar que conoce Next.js)
    return NextResponse.json(
      {
        message: "Vehicle created successfully",
        data: result
      },
      { status: 201 }
    );

  } catch (error: any) {

    console.error("❌ [VEHÍCULOS] ERROR FATAL ATRAPADO:", error.message || error);

    // Manejo de errores controlado
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

  try{
    const result = await vehicleController.getAll(); 
    return NextResponse.json(
      {message: "Vehicles retrieved successfully", data: result }, 
      {status : 200}
    ); 
  }catch (error){ 
    return NextResponse.json(
      { message: "Error retrieving vehicles", error: error instanceof Error ? error.message : "Unknow error"}, 
      {status: 500}

    ); 
  }
}