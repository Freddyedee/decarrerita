"use server";

import { WalletContainer } from "@/shared/container/WalletContainer";
import { revalidatePath } from "next/cache";

export async function aprobarRecarga(recargaId: number) {
  try {
    await WalletContainer.aprobarRecargaUseCase.execute(recargaId);
    revalidatePath("/recargas");
    return { success: true, message: "Recarga aprobada y saldo acreditado." };
  } catch (error: unknown) {
    console.error("Error aprobando recarga:", error);
    const msg = error instanceof Error ? error.message : "Error al procesar la aprobación.";
    return { success: false, error: msg };
  }
}

export async function rechazarRecarga(recargaId: number) {
  try {
    await WalletContainer.rechazarRecargaUseCase.execute(recargaId);
    revalidatePath("/recargas");
    return { success: true, message: "Solicitud de recarga rechazada." };
  } catch (error: unknown) {
    console.error("Error rechazando recarga:", error);
    const msg = error instanceof Error ? error.message : "Error al rechazar la recarga.";
    return { success: false, error: msg };
  }
}