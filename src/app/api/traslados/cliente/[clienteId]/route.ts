import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET(req: NextRequest, { params }: { params: { clienteId: string } }) {
  try {
    const traslados = await trasladoController.getByCliente(Number(params.clienteId));
    return NextResponse.json({ message: "Historial retrieved successfully", data: traslados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving historial", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}