"use server";

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";

// IMPORTANTE: Ajusta esta ruta hacia donde guardaste tu archivo traslado.modules.ts
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";
import { tarifaRepository } from "@/modules/Tarifa/presentation/tarifa.modules";

export async function verificarViajePendienteCalificar(esCliente: boolean) {
  try {
    const sesion = await getCurrentRole();
    if (!sesion || !sesion.usuarioId) {
      return { success: false, trasladoId: null };
    }

    const usuarioId = sesion.usuarioId;

    // Buscamos un traslado completado donde este usuario participó
    // y donde AÚN NO exista una calificación con su rol (esCliente: true/false)
    const viajePendiente = await prisma.traslado.findFirst({
      where: {
        ...(esCliente ? { id_cliente: usuarioId } : { id_chofer: usuarioId }),
        estado_actual: {
          in: ["FINALIZADO", "COMPLETADO"],
        },
        // Clave: solo filtra que NO exista una calificación del rol actual
        calificacion: {
          none: {
            calificador_es_cliente: esCliente,
          },
        },
      },
      orderBy: {
        fecha_solicitud: "desc",
      },
      select: {
        id_traslado: true,
      },
    });

    if (viajePendiente) {
      return { success: true, trasladoId: viajePendiente.id_traslado };
    }

    return { success: true, trasladoId: null };
  } catch (error) {
    console.error("❌ [ERROR VERIFICANDO PENDIENTES]:", error);
    return { success: false, trasladoId: null };
  }
}

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
      trasladoId: resultado.traslado.id,
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
    if (distanciaKm <= 0) {
      return { success: false, error: "Distancia inválida." };
    }

    // 1. Consultamos la tarifa vigente real en la base de datos (PostgreSQL)
    const tarifa = await tarifaRepository.findVigente();

    if (!tarifa) {
      return { 
        success: false, 
        error: "No hay una tarifa vigente configurada en el sistema." 
      };
    }

    // 2. Usamos el método de tu entidad de dominio para calcular el costo
    const costoCalculado = Number(tarifa.calcularCosto(distanciaKm).toFixed(2));

    // 3. Extraemos la base y precio por km de la BD para el desglose
    const base = Number(tarifa.tarifaBase).toFixed(2);
    const precioKm = Number(tarifa.precioKm).toFixed(2);

    return { 
      success: true, 
      costo: costoCalculado,
      desglose: `Tarifa base ($${base}) + ${distanciaKm} km × $${precioKm}/km (Tarifa Vigente BD)`
    };
  } catch (error) {
    console.error("❌ [ERROR COTIZANDO VIAJE EN BD]:", error);
    return { success: false, error: "No se pudo calcular la tarifa desde la base de datos." };
  }
}