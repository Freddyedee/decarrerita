import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ choferId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const desdeParam = searchParams.get("desde");
    const hastaParam = searchParams.get("hasta");
    const { choferId } = await params;

    const idChoferNum = Number(choferId);
    if (isNaN(idChoferNum) || !desdeParam || !hastaParam) {
      return NextResponse.json(
        { success: false, message: "ID de chofer y fechas son obligatorios." },
        { status: 400 }
      );
    }

    const desde = new Date(`${desdeParam}T00:00:00.000Z`);
    const hasta = new Date(`${hastaParam}T23:59:59.999Z`);

    // 1. OBTENEMOS LA TARIFA DINÁMICA DE LA BD
    const tarifaActiva = await prisma.tarifa.findFirst({
      where: { fecha_fin_vigencia: null },
      orderBy: { id_tarifa: "desc" }
    }) || await prisma.tarifa.findFirst({ orderBy: { id_tarifa: "desc" } });

    const comisionEmpresa = Number(
      (tarifaActiva as any)?.porcentaje_comision ?? 
      (tarifaActiva as any)?.comision ?? 
      (tarifaActiva as any)?.porcentaje_empresa ?? 
      15
    );
    const comisionChofer = 100 - comisionEmpresa;

    // 2. Buscamos la wallet del chofer
    const walletChofer = await prisma.wallet.findUnique({
      where: { id_usuario: idChoferNum },
      include: {
        usuario: { select: { nombre: true, apellido: true, email: true, telefono: true } }
      }
    });

    if (!walletChofer) {
      return NextResponse.json(
        { success: false, message: `No se encontró wallet para el chofer con ID ${idChoferNum}` },
        { status: 404 }
      );
    }

    // 3. Consultamos el HISTORIAL REAL DE RETIROS (solicitud_retiro)
    const retirosAprobados = await prisma.solicitud_retiro.findMany({
      where: {
        id_wallet: walletChofer.id_wallet,
        estado: { in: ["APROBADA", "PAGADO", "COMPLETADO", "PROCESADO", "aprobada", "pagado"] },
        fecha_solicitud: { gte: desde, lte: hasta },
      },
      include: { banco: true },
      orderBy: { fecha_solicitud: "desc" },
    });

    let totalPagado = retirosAprobados.reduce((sum, r) => sum + Number(r.monto || 0), 0);

    // 4. Respaldo dinámico: Aplicamos la proporción dinámica del chofer (Ej: 85 / 100 = 0.85)
    if (totalPagado === 0) {
      const trasladosCompletados = await prisma.traslado.aggregate({
        where: {
          id_chofer: idChoferNum,
          estado_actual: { in: ["FINALIZADO", "COMPLETADO", "PAGADO"] },
          fecha_solicitud: { gte: desde, lte: hasta },
        },
        _sum: { costo_estimado: true },
        _count: { id_traslado: true }
      });

      const bruto = Number(trasladosCompletados._sum.costo_estimado || 0);
      totalPagado = Number((bruto * (comisionChofer / 100)).toFixed(2));
    }

    const historialMapeado = retirosAprobados.map((r: any) => ({
      idSolicitud: r.id_retiro,
      monto: Number(r.monto || 0),
      estado: r.estado,
      fechaSolicitud: r.fecha_solicitud,
      fechaProcesamiento: r.fecha_procesamiento || r.fecha_solicitud,
      referencia: r.numero_cuenta ? `Cta: ${r.numero_cuenta}` : `Retiro #${r.id_retiro}`,
      banco: r.banco ? (r.banco.nombre_banco || r.banco.nombre || `Banco #${r.id_banco}`) : `Banco #${r.id_banco}`,
      titular: r.titular_cuenta || "N/A"
    }));

    return NextResponse.json({
      success: true,
      chofer: walletChofer.usuario 
        ? `${walletChofer.usuario.nombre} ${walletChofer.usuario.apellido || ""}`.trim() 
        : `Chofer #${idChoferNum}`,
      totalPagado,
      comisionEmpresa,
      comisionChofer, // <-- RETORNAMOS EL VALOR DINÁMICO AL FRONTEND
      historialRetiros: historialMapeado,
      rango: { desde: desdeParam, hasta: hastaParam }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("❌ [ERROR REPORTES CHOFER]:", error);
    const msg = error instanceof Error ? error.message : "Error calculando reporte del chofer";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}