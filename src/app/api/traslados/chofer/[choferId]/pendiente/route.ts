import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { EstadoRespuesta } from "@/modules/Traslado/domain/Enum/EstadoRespuesta";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ choferId: string }> }
) {
  try {
    const { choferId } = await params;
    const idNum = Number(choferId);

    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ message: "ID de chofer inválido" }, { status: 400 });
    }

    // 1. Buscamos en asignacion_chofer si hay alguna oferta PENDIENTE para este chofer
    const asignacion = await prisma.asignacion_chofer.findFirst({
      where: {
        id_chofer: idNum,
        estado_respuesta: EstadoRespuesta.PENDIENTE,
      },
      include: {
        traslado: true, // Traemos también las coordenadas y el costo del viaje
      },
      orderBy: {
        id_asignacion: "desc",
      },
    });

    if (!asignacion) {
      return NextResponse.json({ message: "Sin ofertas pendientes", data: null }, { status: 200 });
    }

    // 2. Mapeamos la respuesta limpia para el Radar
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
    console.error("❌ Error consultando asignación pendiente:", error);
    return NextResponse.json(
      { message: "Error consultando ofertas", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}