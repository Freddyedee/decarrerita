"use server";

import { revalidatePath } from "next/cache";

// Importamos la capa de módulos (DDD)
import { RegisterVehicleInspectionsUseCase } from "@/modules/vehicles/application/use-cases/RegisterVehicleInspectionUseCase";
import { RevisionRepository } from "@/modules/vehicles/infrastructure/prisma/revision.repository";
import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";

export async function registrarRevisionVehicular(formData: FormData) {
  try {
    // 1. Parseo de datos de la interfaz
    const idVehiculo = Number(formData.get("idVehiculo"));
    const calificacion = Number(formData.get("calificacion"));
    const observaciones = formData.get("observaciones") as string;

    // 2. Instanciamos los repositorios concretos
    // (A diferencia de tu módulo de usuarios, estos repositorios importan Prisma internamente, 
    // por lo que no hace falta inyectárselos en el constructor)
    const revisionRepo = new RevisionRepository();
    const vehicleRepo = new VehicleRepository();

    // 3. Instanciamos el Caso de Uso
    const useCase = new RegisterVehicleInspectionsUseCase(revisionRepo, vehicleRepo);

    // 4. Ejecutamos la lógica de negocio
    // El Use Case validará internamente el rango (0-100), calculará la fecha de vencimiento 
    // y coordinará la actualización del estado del vehículo.
    await useCase.execute({
      vehicleId: idVehiculo,
      score: calificacion,
      observations: observaciones,
    });

    // 5. Refrescamos la UI
    revalidatePath("/vehiculos");
    
    return { success: true };
  } catch (error) {
    console.error("Error al registrar revisión:", error);
    // Retornamos el mensaje de error capturado por tu Entidad/UseCase para mostrarlo en el frontend
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error interno del servidor" 
    };
  }
}