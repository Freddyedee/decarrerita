import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ message: "ID de chofer inválido" }, { status: 400 });
    }

    // 1. Extraemos el booleano del body
    const body = await request.json(); 
    const disponibleVal = Boolean(body.disponible);

    console.log(`📡 [API Disponibilidad] Cambiando chofer ID ${idNum} a disponible = ${disponibleVal}`);

    // 2. Actualizamos estrictamente la columna 'disponible' en la tabla chofer
    const updated = await prisma.chofer.update({
      where: { id_usuario: idNum },
      data: { disponible: disponibleVal },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Chofer ahora está ${disponibleVal ? "ONLINE (true)" : "OFFLINE (false)"}`,
        data: {
          id_usuario: updated.id_usuario,
          disponible: updated.disponible,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [ERROR API DISPONIBILIDAD]:", error);
    return NextResponse.json(
      { 
        message: "Error al actualizar disponibilidad en BD", 
        error: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    );
  }
}