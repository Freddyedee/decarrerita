"use server";

import { UserContainer } from "@/shared/container/UserContainer";
import { revalidatePath } from "next/cache";

export async function actualizarPerfil(
  userId: number, 
  email: string, 
  currentPasswordHash: string,
  formData: FormData
) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string; // Aquí lo extraemos
    
    const passwordHashToSend = currentPasswordHash; 

    // Ejecutamos el caso de uso agregando el campo 'phone'
    await UserContainer.updateUserProfileUseCase.execute({
      userId,
      firstName,
      lastName,
      email,
      phone, 
      password: passwordHashToSend, 
    });

    revalidatePath("/perfil");
    return { success: true, message: "Perfil actualizado correctamente." };
  } catch (error: unknown) { // ¡SOLUCIONADO! Usamos unknown en lugar de any
    console.error("Error al actualizar perfil:", error);
    
    // Verificamos si el error es una instancia de la clase Error
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    
    return { success: false, error: errorMessage };
  }
}