"use server";

import { revalidatePath } from "next/cache";
import {prisma} from "@/shared/lib/prisma"; // Importamos la instancia singleton

// Importamos la capa de módulos
import { RegisterPsychologicalEvaluationUseCase } from "@/modules/user/application/use-cases/RegisterPsychologicalEvaluationUseCase";
import { PrismaPsychologicalEvaluationRepository } from "@/modules/user/infrastructure/repositories/PrismaPsychologicalEvaluationRepository";
import { PrismaDriverRepository } from "@/modules/user/infrastructure/repositories/PrismaDriverRepository";

export async function registrarEvaluacion(formData: FormData) {
  try {
    // 1. Parseo de datos de la interfaz
    const idChofer = Number(formData.get("idChofer"));
    const calificacion = Number(formData.get("calificacion"));
    const observaciones = formData.get("observaciones") as string;

    const fechaExpiracion = new Date();
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1); 

    // 2. Instanciamos los repositorios concretos
    // (Si tienes configurado UserContainer.ts en tu capa compartida, puedes inyectarlo desde ahí)
    const driverRepo = new PrismaDriverRepository(prisma);
    const evaluationRepo = new PrismaPsychologicalEvaluationRepository(prisma);

    // 3. Instanciamos el Caso de Uso
    const useCase = new RegisterPsychologicalEvaluationUseCase(driverRepo, evaluationRepo);

    // 4. Ejecutamos la lógica de negocio
    await useCase.execute({
      driverUserId: idChofer,
      score: calificacion,
      observations: observaciones,
      expirationDate: fechaExpiracion, 
    });

    // 5. Refrescamos la UI
    revalidatePath("/evaluaciones");
    
    return { success: true };
  } catch (error) {
    console.error("Error al registrar evaluación:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error interno del servidor" 
    };
  }
}