import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Extraemos el id de la URL de forma asíncrona (Estándar de Next.js)
    const { id } = await params;
    const trasladoId = Number(id);

    // 2. GUARD DE SEGURIDAD (Rescatado de origin/Auth)
    if (!trasladoId || isNaN(trasladoId) || trasladoId <= 0) {
      return NextResponse.json(
        { 
          message: "ID de traslado inválido.", 
          error: "La ruta debe contener un ID numérico válido. Ejemplo: /api/traslados/5/iniciar" 
        },
        { status: 400 }
      );
    }

    // 3. Ejecutamos el controlador hexagonal
    const traslado = await trasladoController.iniciar(trasladoId);
    
    return NextResponse.json(
      { 
        message: "Traslado iniciado, cliente cobrado", 
        data: traslado 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ [ERROR EN API INICIAR TRASLADO]:", error);
    return NextResponse.json(
      { 
        message: "Error iniciando traslado", 
        error: error instanceof Error ? error.message : "Error interno desconocido" 
      },
      { status: 400 }
    );
  }
}