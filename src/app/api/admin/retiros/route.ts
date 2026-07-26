import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const retiros = await prisma.solicitud_retiro.findMany({
      include: {
        wallet: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
                email: true,
              }
            }
          }
        },
        banco: {
          select: {
            nombre_banco: true,
          }
        }
      },
      orderBy: {
        fecha_solicitud: "desc",
      },
    });

    return NextResponse.json(retiros, { status: 200 });
  } catch (error) {
    console.error("❌ [API GET RETIROS] Error:", error);
    return NextResponse.json(
      { message: "Error al obtener solicitudes de retiro" },
      { status: 500 }
    );
  }
}