"use server";

import { revalidatePath } from "next/cache";

export async function aprobarRetiro(retiroId: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/admin/retiros/${retiroId}/aprobar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al aprobar retiro");
    }

    revalidatePath("/pagos");
    return { success: true, message: "Retiro aprobado y procesado exitosamente." };
  } catch (error: unknown) {
    console.error("Error aprobando retiro:", error);
    const msg = error instanceof Error ? error.message : "Error al procesar la aprobación.";
    return { success: false, error: msg };
  }
}