import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = Number(id);

    if (!usuarioId || isNaN(usuarioId)) {
      return NextResponse.json({ message: "ID de usuario inválido" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { id_usuario: usuarioId },
      include: {
        movimiento_wallet: {
          orderBy: { fecha_movimiento: "desc" },
          take: 20, // Últimos 20 movimientos
        },
        solicitud_retiro: {
          orderBy: { fecha_solicitud: "desc" },
          take: 10,
          include: { banco: true }
        }
      }
    });

    if (!wallet) {
      return NextResponse.json({ message: "Wallet no encontrada para este usuario" }, { status: 404 });
    }

    return NextResponse.json({ message: "Wallet obtenida con éxito", data: wallet }, { status: 200 });
  } catch (error) {
    console.error("❌ [API WALLET GET] Error:", error);
    return NextResponse.json(
      { message: "Error obteniendo datos de la wallet", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}