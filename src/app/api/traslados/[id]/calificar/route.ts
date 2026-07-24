import { NextRequest, NextResponse } from "next/server";
import { calificacionController } from "@/modules/calificacion/presentation/calificacion.modules";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const raw = await req.json();
    const { id } = await params; // Extraemos el id

    const data = await calificacionController.calificar({
      trasladoId: Number(id), // Usamos el id
      calificadorEsCliente: Boolean(raw.calificadorEsCliente),
      puntuacion: Number(raw.puntuacion),
      comentario: raw.comentario
    });

    return NextResponse.json({ message: "Calificacion registered successfully", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error registering calificacion", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}