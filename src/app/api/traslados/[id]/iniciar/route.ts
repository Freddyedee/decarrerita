import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const traslado = await trasladoController.iniciar(Number(params.id));
    return NextResponse.json({ message: "Traslado iniciado, cliente cobrado", data: traslado }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error iniciando traslado", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}