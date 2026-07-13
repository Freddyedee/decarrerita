// Importamos los tipos necesarios para manejar la petición y respuesta HTTP
import { NextRequest, NextResponse } from "next/server";
// Importamos el controlador que contiene la lógica para procesar traslados
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

// Exportamos la función POST, lo que indica que este endpoint solo acepta peticiones POST
export async function POST(req: NextRequest) {
  try {
    // 1. Extraemos el cuerpo (body) de la petición que envió el cliente
    const raw = await req.json();

    // 2. Llamamos al controlador de traslados, mapeando los datos recibidos (raw)
    // al formato que nuestro Caso de Uso espera. Usamos Number() para asegurar
    // que los datos vengan como números y no como texto.
    const result = await trasladoController.solicitar({
      clienteId: Number(raw.clienteId),
      origenlat: Number(raw.origenLat),
      origenlng: Number(raw.origenLng),
      destinolat: Number(raw.destinoLat),
      destinolng: Number(raw.destinoLng),
      distanciaEstimadaKm: Number(raw.distanciaEstimadaKm)
    });

    // 3. Si todo salió bien, devolvemos un código 201 (Created)
    // junto con el resultado de la operación en formato JSON
    return NextResponse.json(
      { message: "Traslado solicitado, generando ofertas", data: result },
      { status: 201 }
    );
    
  } catch (error) {
    // 4. Si algo falló (validación, error de DB, etc.), capturamos el error
    // y devolvemos un código 400 (Bad Request).
    return NextResponse.json(
      { 
        message: "Error solicitando traslado", 
        // Comprobamos si es un error real de JavaScript para mostrar el mensaje,
        // si no, devolvemos un mensaje genérico.
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 400 }
    );
  }
}