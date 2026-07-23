import { IRecargaRepository } from "../../domain/ports/IRecargaRepository";
import { EstadoRecarga } from "../../domain/enums/EstadoRecarga";

export class RechazarRecargaUseCase {
  constructor(private readonly recargaRepository: IRecargaRepository) {}

  async execute(recargaId: number): Promise<void> {
    const recarga = await this.recargaRepository.findById(recargaId);
    if (!recarga) {
      throw new Error("Solicitud de recarga no encontrada.");
    }

    if (recarga.getStatus() !== EstadoRecarga.PENDIENTE) {
      throw new Error("Solo se pueden rechazar recargas en estado PENDIENTE.");
    }

    recarga.setStatus(EstadoRecarga.RECHAZADA);
    await this.recargaRepository.update(recarga);
  }
}