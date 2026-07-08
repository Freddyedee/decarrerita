import { NextRequest, NextResponse } from "next/server";
import { marcaController } from "@/modules/vehicles/presentation/vehicle.modules";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const marca = await marcaController.create({ nombre: body.nombre, descripcion: body.descripcion });
    return NextResponse.json({ message: "Marca created successfully", data: marca }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating marca", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const marcas = await marcaController.getAll();
    return NextResponse.json({ message: "Marcas retrieved successfully", data: marcas }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving marcas", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}