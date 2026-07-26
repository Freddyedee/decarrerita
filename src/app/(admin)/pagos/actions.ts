"use server";

import { revalidatePath } from "next/cache";
import { WalletService } from "@/modules/wallet/application/services/WalletService";
import { WalletRepository } from "@/modules/wallet/infrastructure/prisma/wallet.repository";
import { PrismaSolicitudRetiroRepository } from "@/modules/wallet/infrastructure/prisma/solicitudRetiro.repository";
import { ConfiguracionRepository } from "@/modules/configuracion/infrastructure/prisma/configuracion.repository";
import { AprobarRetiroUseCase } from "@/modules/wallet/application/use-cases/AprobarRetiroUseCase";
import { PrismaTransactionManager } from "@/shared/infrastructure/PrismaTransactionManager";

export async function aprobarRetiro(retiroId: number) {
  try {
    // Instanciar repositorios
    const walletRepo = new WalletRepository();
    const configRepo = new ConfiguracionRepository();
    const solicitudRepo = new PrismaSolicitudRetiroRepository();
    
    // Instanciar servicio
    const walletService = new WalletService(walletRepo, configRepo);
    
    // Instanciar transaction manager
    const txManager = new PrismaTransactionManager();
    
    // Instanciar use case
    const useCase = new AprobarRetiroUseCase(walletService, solicitudRepo, txManager);
    
    // Ejecutar
    const solicitudAprobada = await useCase.execute(retiroId);
    
    // Revalidar cache
    revalidatePath("/pagos");
    
    return { 
      success: true, 
      message: "Retiro aprobado y procesado exitosamente.",
      data: solicitudAprobada
    };
  } catch (error: unknown) {
    console.error("Error aprobando retiro:", error);
    const msg = error instanceof Error ? error.message : "Error al procesar la aprobación.";
    return { success: false, error: msg };
  }
}