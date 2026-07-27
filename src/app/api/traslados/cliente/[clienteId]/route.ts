import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clienteId: string }> }
) {
  try {
    const { clienteId } = await params;

    if (!clienteId || isNaN(Number(clienteId))) {
      return NextResponse.json({ message: "ID de cliente inválido" }, { status: 400 });
    }

    const traslados = await trasladoController.getByCliente(Number(clienteId));
    
    return NextResponse.json(
      { message: "Historial de traslados obtenido con éxito", data: traslados },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [API TRASLADOS CLIENTE] Error:", error);
    return NextResponse.json(
      { message: "Error al recuperar traslados del cliente", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}