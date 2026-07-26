import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { EstadoRespuesta } from "@/modules/Traslado/domain/Enum/EstadoRespuesta";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- Ahora es "id"
) {
  console.log("🟢 [RADAR CHOFER] Petición GET recibida en /api/drivers/[id]/pendiente");
  try {
    const { id } = await params;
    const idNum = Number(id);

    console.log(`📡 [RADAR CHOFER] Consultando para Chofer ID: ${idNum}`);

    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ message: "ID de chofer inválido" }, { status: 400 });
    }

    // 1. Buscamos en asignacion_chofer la oferta PENDIENTE
    const asignacion = await prisma.asignacion_chofer.findFirst({
      where: {
        id_chofer: idNum,
        estado_respuesta: EstadoRespuesta.PENDIENTE,
      },
      include: {
        traslado: true,
      },
      orderBy: {
        id_asignacion: "desc",
      },
    });

    if (!asignacion) {
      console.log(`🟡 [RADAR CHOFER] Sin ofertas pendientes para el chofer ${idNum}. Retornando 200.`);
      return NextResponse.json({ message: "Sin ofertas pendientes", data: null }, { status: 200 });
    }

    console.log(`🚀 [RADAR CHOFER] ¡OFERTA ENCONTRADA! Asignación ID: ${asignacion.id_asignacion} | Traslado ID: ${asignacion.id_traslado}`);

    return NextResponse.json(
      {
        message: "Oferta encontrada",
        data: {
          asignacionId: asignacion.id_asignacion,
          trasladoId: asignacion.id_traslado,
          costoEstimado: Number(asignacion.traslado.costo_estimado),
          distanciaKm: Number(asignacion.traslado.distancia_estimada_km),
          origenLat: Number(asignacion.traslado.origen_latitud),
          origenLng: Number(asignacion.traslado.origen_longitud),
          destinoLat: Number(asignacion.traslado.destino_latitud),
          destinoLng: Number(asignacion.traslado.destino_longitud),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [RADAR CHOFER] Error consultando asignación pendiente:", error);
    return NextResponse.json(
      { message: "Error consultando ofertas", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}