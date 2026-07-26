import { NextRequest, NextResponse } from "next/server";
import { WalletService } from "@/modules/wallet/application/services/WalletService";
import { WalletRepository } from "@/modules/wallet/infrastructure/prisma/wallet.repository";
import { PrismaSolicitudRetiroRepository } from "@/modules/wallet/infrastructure/prisma/solicitudRetiro.repository";
import { ConfiguracionRepository } from "@/modules/configuracion/infrastructure/prisma/configuracion.repository"; 
import { SolicitarRetiroUseCase } from "@/modules/wallet/application/use-cases/SolicitarRetiroUseCase";
import { PrismaTransactionManager } from "@/shared/infrastructure/PrismaTransactionManager";
import { prisma } from "@/shared/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = Number(id);

    if (!usuarioId || isNaN(usuarioId)) {
      return NextResponse.json({ message: "ID de usuario inválido" }, { status: 400 });
    }

    const body = await req.json();
    let { monto, bancoId, numeroCuenta, titularCuenta } = body;

    if (!monto || Number(monto) <= 0) {
      return NextResponse.json({ message: "El monto debe ser un número positivo" }, { status: 400 });
    }

    if (!numeroCuenta || !titularCuenta) {
      return NextResponse.json({ message: "Debe indicar número de cuenta y titular" }, { status: 400 });
    }

    // Si para la prueba no pasas un bancoId, buscamos el primer banco activo en tu BD automáticamente
    if (!bancoId) {
      const bancoReal = await prisma.banco.findFirst();
      if (!bancoReal) {
        return NextResponse.json({ message: "No hay bancos registrados en el sistema para procesar retiros" }, { status: 400 });
      }
      bancoId = bancoReal.id_banco;
    }

    const walletRepo = new WalletRepository();
    const configRepo = new ConfiguracionRepository();
    const solicitudRepo = new PrismaSolicitudRetiroRepository();
    const walletService = new WalletService(walletRepo, configRepo);
    const txManager = new PrismaTransactionManager();

    const useCase = new SolicitarRetiroUseCase(walletService, solicitudRepo, txManager);

    const solicitud = await useCase.execute({
      usuarioId,
      bancoId: Number(bancoId),
      monto: Number(monto),
      numeroCuenta: String(numeroCuenta),
      titularCuenta: String(titularCuenta),
    });

    return NextResponse.json(
      {
        message: "Solicitud de retiro enviada exitosamente",
        data: solicitud,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [API RETIRO] Error en solicitud de retiro:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error al procesar el retiro",
      },
      { status: 400 }
    );
  }
}