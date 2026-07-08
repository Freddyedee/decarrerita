import { NextRequest, NextResponse } from "next/server";
import { configuracionController } from "@/modules/configuracion/presentation/configuracion.modules";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await configuracionController.set({
      nombre: body.nombre,
      valor: body.valor,
      descripcion: body.descripcion
    });
    return NextResponse.json({ message: "Configuracion saved successfully", data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving configuracion", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const result = await configuracionController.getAll();
    return NextResponse.json({ message: "Configuracion retrieved successfully", data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving configuracion", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}