import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Extraemos el id
    const traslado = await trasladoController.completar(Number(id)); // Usamos el id
    
    return NextResponse.json({ message: "Traslado completado, chofer pagado", data: traslado }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error completando traslado", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}