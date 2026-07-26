import { NextRequest, NextResponse } from "next/server";
import { WalletService } from "@/modules/wallet/application/services/WalletService";
import { WalletRepository } from "@/modules/wallet/infrastructure/prisma/wallet.repository";
import { PrismaSolicitudRetiroRepository } from "@/modules/wallet/infrastructure/prisma/solicitudRetiro.repository";
import { ConfiguracionRepository } from "@/modules/configuracion/infrastructure/prisma/configuracion.repository";
import { AprobarRetiroUseCase } from "@/modules/wallet/application/use-cases/AprobarRetiroUseCase";
import { PrismaTransactionManager } from "@/shared/infrastructure/PrismaTransactionManager"; // Verifica tu import de TxManager aquí

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solicitudId = Number(id);

    if (!solicitudId || isNaN(solicitudId)) {
      return NextResponse.json({ message: "ID de solicitud inválido" }, { status: 400 });
    }

    const walletRepo = new WalletRepository();
    const configRepo = new ConfiguracionRepository();
    const solicitudRepo = new PrismaSolicitudRetiroRepository();
    const walletService = new WalletService(walletRepo, configRepo);
    const txManager = new PrismaTransactionManager();

    const useCase = new AprobarRetiroUseCase(walletService, solicitudRepo, txManager);

    const solicitudAprobada = await useCase.execute(solicitudId);

    return NextResponse.json(
      {
        message: "Retiro aprobado y procesado exitosamente",
        data: solicitudAprobada,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [API ADMIN RETIRO] Error aprobando retiro:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error al procesar la aprobación",
      },
      { status: 400 }
    );
  }
}