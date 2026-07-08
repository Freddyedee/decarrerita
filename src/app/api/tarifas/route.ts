import { NextRequest, NextResponse } from "next/server";
import { tarifaController } from "@/modules/Tarifa/presentation/tarifa.modules";
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const tarifa = await tarifaController.create({
      precioKm: Number(raw.precioKm),
      tarifaBase: Number(raw.tarifaBase),
      tarifaCancelacion: Number(raw.tarifaCancelacion),
      porcentajeComision: Number(raw.porcentajeComision)
    });
    return NextResponse.json({ message: "Tarifa created successfully", data: tarifa }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating tarifa", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const tarifa = await tarifaController.getVigente();
    return NextResponse.json({ message: "Tarifa vigente retrieved successfully", data: tarifa }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving tarifa", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 }
    );
  }
}