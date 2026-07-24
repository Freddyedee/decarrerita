import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Extraemos el id
    const traslado = await trasladoController.getById(Number(id)); // Usamos el id
    
    return NextResponse.json({ message: "Traslado retrieved successfully", data: traslado }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving traslado", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 }
    );
  }
}