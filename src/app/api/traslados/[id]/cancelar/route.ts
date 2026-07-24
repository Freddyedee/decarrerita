import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const raw = await req.json(); // { actorId, actorRole: "CLIENTE" | "CHOFER", motivo }
    const { id } = await params; // Extraemos el id

    const traslado = await trasladoController.cancelar({
      trasladoId: Number(id), // Usamos el id
      actorId: Number(raw.actorId),
      actorRole: raw.actorRole,
      motivo: raw.motivo
    });

    return NextResponse.json({ message: "Traslado cancelado", data: traslado }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error cancelando traslado", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}