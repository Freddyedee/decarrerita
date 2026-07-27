import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const marcaId = Number(id);

    if (!marcaId || isNaN(marcaId) || marcaId <= 0) {
      return NextResponse.json(
        { message: "ID de marca inválido" }, 
        { status: 400 }
      );
    }

    // Consultamos los modelos asociados a esa marca ordenados alfabéticamente
    const modelos = await prisma.modelo.findMany({
      where: { id_marca: marcaId },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(
      {
        message: "Modelos obtenidos con éxito",
        data: modelos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [API MODELOS] Error consultando modelos por marca:", error);
    return NextResponse.json(
      {
        message: "Error interno obteniendo los modelos de la marca",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}