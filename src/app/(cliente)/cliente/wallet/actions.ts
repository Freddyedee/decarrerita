"use server";

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { revalidatePath } from "next/cache";
import { WalletContainer } from "@/shared/container/WalletContainer";

export async function registrarSolicitudRecarga(formData: FormData) {
  try {
    const sesion = await getCurrentRole();
    if (!sesion || sesion.rol !== "CLIENTE") {
      return { success: false, error: "No autorizado." };
    }

    const bancoId = Number(formData.get("bancoId"));
    const monto = Number(formData.get("monto"));
    const referenciaPago = formData.get("referencia") as string;

    if (isNaN(monto) || monto <= 0) {
      return { success: false, error: "El monto debe ser un número válido mayor a 0." };
    }

    // Ejecutamos el caso de uso directamente pasando el objeto DTO que espera
    await WalletContainer.solicitarRecargaUseCase.execute({
      usuarioId: sesion.usuarioId,
      bancoId: bancoId,
      monto: monto,
      referenciaPago: referenciaPago
    });

    // IMPORTANTE: Ajusta esta ruta a tu ruta real (ej: "/cliente/wallet")
    revalidatePath("/cliente/wallet"); 
    
    return { success: true, message: "Reporte de recarga enviado. En espera de aprobación administrativa." };

  } catch (error: unknown) {
    console.error("Error al procesar recarga:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido al procesar la recarga.";
    return { success: false, error: msg };
  }
}