// src/app/api/drivers/[id]/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const choferId = Number(id);

    if (isNaN(choferId)) {
      return NextResponse.json({ error: "ID de chofer inválido" }, { status: 400 });
    }

    // 1. Rango del día actual (00:00:00 a 23:59:59)
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    // 2. Agregación SQL en la tabla traslado para HOY
    const metricasHoy = await prisma.traslado.aggregate({
      where: {
        id_chofer: choferId,
        estado_actual: {
          in: ["FINALIZADO", "COMPLETADO"],
        },
        fecha_solicitud: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      _sum: {
        costo_estimado: true,
      },
      _count: {
        id_traslado: true,
      },
    });

    // 3. Consultamos el histórico total desde el perfil del chofer
    const chofer = await prisma.chofer.findUnique({
      where: { id_usuario: choferId },
      select: { viajes_completados: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        gananciasHoy: Number(metricasHoy._sum.costo_estimado || 0),
        viajesListosHoy: metricasHoy._count.id_traslado || 0,
        viajesTotales: chofer?.viajes_completados || 0,
      },
    });
  } catch (error) {
    console.error("❌ [ERROR METRICS CHOFER]:", error);
    return NextResponse.json(
      { error: "Error obteniendo métricas del chofer" },
      { status: 500 }
    );
  }
}