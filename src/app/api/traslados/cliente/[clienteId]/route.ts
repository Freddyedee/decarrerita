import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET(req: NextRequest, { params }: { params: Promise<{ clienteId: string }> }) {
  try {
    // 1. Extraemos el clienteId esperando la promesa
    const { clienteId } = await params; 

    // 2. Usamos la variable extraída
    const traslados = await trasladoController.getByCliente(Number(clienteId));
    
    return NextResponse.json({ message: "Historial retrieved successfully", data: traslados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving historial", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}