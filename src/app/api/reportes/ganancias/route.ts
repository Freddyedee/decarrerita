import { NextRequest, NextResponse } from "next/server";
import { reportesController } from "@/modules/wallet/presentation/wallet.modules";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const desdeParam = searchParams.get("desde");
    const hastaParam = searchParams.get("hasta");

    if (!desdeParam || !hastaParam) {
      return NextResponse.json(
        { success: false, message: "Los parámetros 'desde' y 'hasta' son obligatorios." },
        { status: 400 }
      );
    }

    const desde = new Date(`${desdeParam}T00:00:00.000Z`);
    const hasta = new Date(`${hastaParam}T23:59:59.999Z`);

    // 1. OBTENEMOS EL PORCENTAJE DINÁMICO DE LA TABLA TARIFA
    const tarifaActiva = await prisma.tarifa.findFirst({
      where: { fecha_fin_vigencia: null },
      orderBy: { id_tarifa: "desc" }
    }) || await prisma.tarifa.findFirst({ orderBy: { id_tarifa: "desc" } });

    // Leemos el campo de porcentaje (comision, porcentaje, porcentaje_comision, etc.)
    const comisionEmpresa = Number(
      (tarifaActiva as any)?.porcentaje_comision ?? 
      (tarifaActiva as any)?.comision ?? 
      (tarifaActiva as any)?.porcentaje_empresa ?? 
      15
    );
    const comisionChofer = 100 - comisionEmpresa;

    let gananciasEfectivas: number | null = null;
    let volumenTotal = 0;
    let totalViajes = 0;

    // 2. Intentamos obtener el cálculo desde tu arquitectura hexagonal
    try {
      const resController = await reportesController.getGanancias(desde, hasta);
      if (typeof resController === "number") {
        gananciasEfectivas = resController;
      } else if (resController && typeof resController === "object" && "ganancias" in resController) {
        gananciasEfectivas = Number((resController as any).ganancias);
      }
    } catch (errHexagonal) {
      console.warn("⚠️ [REPORTES] Aviso en controlador hexagonal, aplicando consulta directa a BD.");
    }

    // 3. Respaldo o agregación directa usando el PORCENTAJE DINÁMICO
    if (gananciasEfectivas === null || isNaN(gananciasEfectivas) || gananciasEfectivas === 0) {
      const agregacion = await prisma.traslado.aggregate({
        where: {
          estado_actual: { in: ["FINALIZADO", "COMPLETADO", "PAGADO"] },
          fecha_solicitud: { gte: desde, lte: hasta },
        },
        _sum: { costo_estimado: true },
        _count: { id_traslado: true },
      });

      volumenTotal = Number(agregacion._sum.costo_estimado || 0);
      totalViajes = agregacion._count.id_traslado || 0;
      
      // Aplicamos la comisión dinámica (Ej: 15 / 100 = 0.15)
      gananciasEfectivas = Number((volumenTotal * (comisionEmpresa / 100)).toFixed(2));
    }

    return NextResponse.json({
      success: true,
      message: "Ganancias calculadas con éxito",
      ganancias: gananciasEfectivas,
      comisionEmpresa, // <-- RETORNAMOS EL VALOR DINÁMICO AL FRONTEND
      comisionChofer,
      data: {
        ganancias: gananciasEfectivas,
        volumenTotal,
        totalViajes,
        comisionEmpresa,
        comisionChofer,
        rango: { desde: desdeParam, hasta: hastaParam }
      }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("❌ [ERROR API GANANCIAS]:", error);
    const msg = error instanceof Error ? error.message : "Error interno al calcular ganancias";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}