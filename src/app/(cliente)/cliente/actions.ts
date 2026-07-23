"use server";

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { revalidatePath } from "next/cache";

// IMPORTANTE: Ajusta esta ruta hacia donde guardaste tu archivo traslado.modules.ts
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function solicitarNuevoTraslado(formData: FormData) {
  try {
    // 1. Validamos la sesión y el rol del usuario
    const sesion = await getCurrentRole();
    if (!sesion || sesion.rol !== "CLIENTE") {
      return { success: false, error: "No tienes permisos para solicitar un traslado." };
    }

    // 2. Extraemos y convertimos las coordenadas y distancia enviadas por el mapa
    const origenlat = Number(formData.get("origenlat"));
    const origenlng = Number(formData.get("origenlng"));
    const destinolat = Number(formData.get("destinolat"));
    const destinolng = Number(formData.get("destinolng"));
    const distanciaEstimadaKm = Number(formData.get("distanciaEstimadaKm"));

    // 3. Validación de seguridad básica en el backend
    if (isNaN(origenlat) || isNaN(destinolat) || distanciaEstimadaKm <= 0) {
      return { 
        success: false, 
        error: "Coordenadas o distancia inválidas. Por favor selecciona los puntos en el mapa." 
      };
    }

    // 4. Ejecutamos el Caso de Uso a través de tu Controlador Hexagonal exacto
    const resultado = await trasladoController.solicitar({
      clienteId: sesion.usuarioId,
      origenlat,
      origenlng,
      destinolat,
      destinolng,
      distanciaEstimadaKm,
    });

    // 5. Refrescamos las rutas para que la UI se actualice
    revalidatePath("/");
    revalidatePath("/cliente/historial");
    revalidatePath("/historial");

    return { 
      success: true, 
      message: `¡Viaje #${resultado.traslado.id} solicitado con éxito! Tarifa estimada: $${resultado.traslado.costoEstimado}. Generando cola y buscando chofer...` 
    };

  } catch (error: unknown) {
    console.error("❌ [ERROR SOLICITANDO TRASLADO]:", error);
    
    // Capturamos los errores de negocio que lanza tu SolicitarTrasladoUseCase
    // (Ej: "Ya tienes un traslado en curso", "Saldo insuficiente", etc.)
    const msg = error instanceof Error ? error.message : "Ocurrió un error interno al procesar el traslado.";
    
    return { success: false, error: msg };
  }
}

// Agrega esto en tu actions.ts del cliente

export async function cotizarViaje(distanciaKm: number) {
  try {
    if (distanciaKm <= 0) return { success: false, error: "Distancia inválida." };

    // Aquí puedes aplicar la fórmula real de tu negocio o consultar tu tabla Tarifa en BD.
    // Por ejemplo: Tarifa Base ($3.00) + ($1.20 por Kilómetro)
    const tarifaBase = 3.00;
    const costoPorKm = 1.20;
    const costoCalculado = Number((tarifaBase + (distanciaKm * costoPorKm)).toFixed(2));

    return { 
      success: true, 
      costo: costoCalculado,
      desglose: `Tarifa base ($${tarifaBase}) + ${distanciaKm} km x $${costoPorKm}/km`
    };
  } catch (error) {
    return { success: false, error: "No se pudo calcular la tarifa." };
  }
}