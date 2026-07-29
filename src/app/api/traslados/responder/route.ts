import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json(); // { asignacionId, respuesta: "ACEPTADO" | "RECHAZADO" }

    const result = await trasladoController.responder({
      asignacionId: Number(raw.asignacionId),
      respuesta: raw.respuesta
    });

    return NextResponse.json({ message: "Respuesta procesada", data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error procesando respuesta", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}