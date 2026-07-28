// src/app/api/admin/traslados/route.ts
import { NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET() {
  try {
    const traslados = await trasladoController.getAll();

    return NextResponse.json({
      success: true,
      data: traslados,
    });
  } catch (error: unknown) {
    console.error("❌ [ADMIN TRASLADOS ERROR]:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Error interno al obtener el historial de traslados.";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}