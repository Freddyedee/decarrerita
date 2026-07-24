import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { IRecargaRepository } from "../../domain/ports/IRecargaRepository";
import { EstadoRecarga } from "../../domain/enums/EstadoRecarga";
import { prisma } from "@/shared/lib/prisma";

export class AprobarRecargaUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly recargaRepository: IRecargaRepository
  ) {}

  async execute(recargaId: number): Promise<void> {
    // Usamos una transacción atómica de Prisma
    await prisma.$transaction(async (tx) => {
      // 1. Buscamos la recarga
      const recarga = await this.recargaRepository.findById(recargaId, tx);
      if (!recarga) {
        throw new Error("Solicitud de recarga no encontrada.");
      }

      if (recarga.getStatus() !== EstadoRecarga.PENDIENTE) {
        throw new Error("La recarga no se encuentra en estado PENDIENTE.");
      }

      // 2. Actualizamos la recarga a APROBADA
      recarga.setStatus(EstadoRecarga.APROBADA);
      if (recarga.setFechaAprobacion) {
        recarga.setFechaAprobacion(new Date());
      }
      await this.recargaRepository.update(recarga, tx);

      // 3. Buscamos la Wallet del cliente
      const wallet = await this.walletRepository.findById(
        // Si tu entidad recarga tiene walletId:
        recarga.walletId, 
        tx
      );

      if (!wallet) {
        throw new Error("Wallet asociada no encontrada.");
      }

      // 4. Acreditamos el saldo y registramos el movimiento de entrada
      const saldoAnterior = wallet.saldoDisponible;
      wallet.acreditar(recarga.getMonto()); // Método de tu entidad Wallet

      await this.walletRepository.updateWithMovement(
        wallet,
        "RECARGA",
        recarga.getMonto(),
        saldoAnterior,
        null,
        `Recarga #${recarga.id} aprobada por administración`,
        tx
      );
    });
  }
}