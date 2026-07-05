import { NextRequest, NextResponse } from "next/server";

import { VehicleController } from "@/modules/vehicles/presentation/vehicle.controller"; 
import { CreateVehicleUseCase } from "@/modules/vehicles/application/create-vehicle";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";

export async function POST(req: NextRequest) {

  try {

    // 📥 Convertimos request HTTP a objeto plano
    const body = await req.json();

    // 🔌 Inyección manual de dependencias (sin framework DI aún)
    const repository = new VehicleRepository();
    const useCase = new CreateVehicleUseCase(repository);
    const controller = new VehicleController(useCase);

    // Ejecutamos lógica del dominio
    const result = await controller.create(body);

    // Respuesta HTTP (único lugar que conoce Next.js)
    return NextResponse.json(
      {
        message: "Vehicle created successfully",
        data: result
      },
      { status: 201 }
    );

  } catch (error) {

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