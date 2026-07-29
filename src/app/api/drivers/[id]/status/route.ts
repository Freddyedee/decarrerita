// src/app/api/drivers/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Compatible con Next.js 14 y 15
) {
  try {
    const { id } = await params;
    const choferIdNum = Number(id);

    if (isNaN(choferIdNum)) {
      return NextResponse.json(
        { success: false, message: "ID de chofer inválido" },
        { status: 400 }
      );
    }

    // 1. Leemos el body que envía ChoferDashboardClient.tsx
    const body = await req.json();
    const nuevoEstado = Boolean(body.disponible);
    const vehiculoId = body.vehiculoId ? Number(body.vehiculoId) : undefined;

    // 2. ACTUALIZACIÓN GARANTIZADA EN PRISMA (Usando id_usuario según el esquema oficial)
    const choferActualizado = await prisma.chofer.update({
      where: {
        id_usuario: choferIdNum, // <-- CLAVE CORRECTA SEGÚN TU SCHEMA.PDF
      },
      data: {
        disponible: nuevoEstado,
      },
    });

    // 3. (Opcional) Si también deseas marcar qué vehículo está activo
    if (nuevoEstado && vehiculoId) {
      // Puedes poner todos los autos de este chofer en "inactivo" y solo activar el seleccionado
      await prisma.vehiculo.updateMany({
        where: { id_chofer: choferIdNum },
        data: { estado: "inactivo" },
      });
      await prisma.vehiculo.update({
        where: { id_vehiculo: vehiculoId },
        data: { estado: "activo" },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Estado del chofer actualizado a ${nuevoEstado ? "ONLINE" : "OFFLINE"}`,
        data: choferActualizado,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ [ERROR ACTUALIZANDO DISPONIBILIDAD]:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Error interno al actualizar disponibilidad del chofer";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}