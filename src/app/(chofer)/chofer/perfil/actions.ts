"use server";

import { UserContainer } from "@/shared/container/UserContainer";
import { UpdateUserProfileRequest } from "@/modules/user/application/dto/UpdateUserProfileRequest";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function actualizarPerfilChofer(
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

    // Hash de seguridad para cumplir con el Value Object PasswordHash
    const passwordHashed = await bcrypt.hash(passwordRaw.trim(), 10);

    const payload: UpdateUserProfileRequest = {
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone: phone.trim(),
      password: passwordHashed,
    };

    await UserContainer.updateUserProfileUseCase.execute(payload);

    revalidatePath("/chofer/perfil");
    revalidatePath("/chofer");

    return { success: true, message: "¡Tus datos personales fueron actualizados!" };
  } catch (error: unknown) {
    console.error("❌ [ERROR ACTUALIZANDO PERFIL CHOFER]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar perfil.";
    return { success: false, error: errorMessage };
  }
}