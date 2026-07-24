"use server";

import { UserContainer } from "@/shared/container/UserContainer";
import { UpdateUserProfileRequest } from "@/modules/user/application/dto/UpdateUserProfileRequest";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // 👈 1. Importamos el encriptador (o "bcrypt" si usas ese)

export async function actualizarPerfil(
  userId: number, 
  email: string, 
  formData: FormData
) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passwordRaw = formData.get("password") as string;
    
    if (!firstName || !lastName || !phone || !passwordRaw) {
      return { success: false, error: "Todos los campos, incluida la contraseña, son obligatorios." };
    }

    // 👈 2. ENCRIPTAMOS LA CONTRASEÑA EN TEXTO PLANO
    // El '10' es el costo algorítmico estándar (hace que el hash tenga 60 caracteres)
    const passwordHashed = await bcrypt.hash(passwordRaw.trim(), 10);

    // 3. Ahora sí le enviamos el HASH validado al contrato
    const payload: UpdateUserProfileRequest = {
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone: phone.trim(),
      password: passwordHashed, // 👈 Satisfacemos al Value Object PasswordHash
    };

    // Ejecutamos el caso de uso
    await UserContainer.updateUserProfileUseCase.execute(payload);

    // Refrescamos las rutas
    revalidatePath("/cliente/perfil");
    revalidatePath("/cliente");
    revalidatePath("/perfil");

    return { success: true, message: "¡Perfil y credenciales actualizados con éxito!" };
  } catch (error: unknown) {
    console.error("❌ [ERROR ACTUALIZANDO PERFIL]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar perfil.";
    return { success: false, error: errorMessage };
  }
}