import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

// Aceptamos cualquier variante del nombre de la carpeta dinámica en params
export async function POST(
  req: NextRequest, 
  { params }: { params: { id?: string; trasladoId?: string; id_traslado?: string } }
) {
  try {
    let id = 0;

    // 1. Intentamos leer el ID desde el cuerpo JSON primero (lo que envías con -d en cURL)
    try {
      const body = await req.json();
      if (body && (body.trasladoId || body.id)) {
        id = Number(body.trasladoId || body.id);
      }
    } catch {
      // Si la petición no traía cuerpo JSON, ignoramos y pasamos al paso 2
    }

    // 2. Si no vino en el body, lo leemos de los parámetros de la URL ([id], [trasladoId], etc.)
    if (!id) {
      id = Number(params.id || params.trasladoId || params.id_traslado);
    }

    // 3. GUARD DE SEGURIDAD: Validamos que tengamos un número entero válido y no un NaN
    if (!id || isNaN(id) || id <= 0) {
      return NextResponse.json(
        { 
          message: "ID de traslado inválido o faltante.", 
          error: "Debes proporcionar un ID numérico válido en la URL o en el cuerpo JSON." 
        },
        { status: 400 }
      );
    }

    // 4. Ejecutamos el controlador hexagonal con el ID limpio y validado
    const traslado = await trasladoController.iniciar(id);
    
    return NextResponse.json({ 
      message: "Traslado iniciado con éxito, cliente cobrado", 
      data: traslado 
    }, { status: 200 });

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