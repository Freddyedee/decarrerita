import { IBancoRepository } from "../../domain/repositories/IBancoRepository";

export class UpdateBancoStatusUseCase {
  constructor(private readonly bancoRepository: IBancoRepository) {}

  async execute(id: number, activo: boolean) {
    if (!id) {
      throw new Error("El ID del banco es obligatorio");
    }
    
    // Delegamos la actualización al repositorio
    return await this.bancoRepository.updateStatus(id, activo);
  }
}