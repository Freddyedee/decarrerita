// modules/Traslado/presentation/traslado.controller.ts

import { SolicitarTrasladoDTO } from "../application/dto/SolicitarTrasladoDTO";
import { ResponderAsignacionDTO } from "../application/dto/ResponderAsignacionDto";
import { CancelarTrasladoDTO } from "../application/dto/CancelarTrasladoDto";

import { SolicitarTrasladoUseCase } from "../application/use-cases/SolicitarTrasladoUseCase";
import { ResponderAsignacionUseCase } from "../application/use-cases/ResponderAsignacionUseCase";
import { IniciarTrasladoUseCase } from "../application/use-cases/IniciarTrasladoUseCase";
import { CompletarTrasladoUseCase } from "../application/use-cases/CompletarTrasladoUseCase";
import { CancelarTrasladoUseCase } from "../application/use-cases/CancelarTrasladoUseCase";

import { ITrasladoRepository } from "../domain/repositories/ITrasladoRepository";

export class TrasladoController {

    constructor(
        private readonly solicitarTrasladoUseCase: SolicitarTrasladoUseCase,
        private readonly responderAsignacionUseCase: ResponderAsignacionUseCase,
        private readonly iniciarTrasladoUseCase: IniciarTrasladoUseCase,
        private readonly completarTrasladoUseCase: CompletarTrasladoUseCase,
        private readonly cancelarTrasladoUseCase: CancelarTrasladoUseCase,
        private readonly trasladoRepository: ITrasladoRepository
    ) {}

    async solicitar(body: SolicitarTrasladoDTO) {
        return this.solicitarTrasladoUseCase.execute(body);
    }

    async responder(body: ResponderAsignacionDTO) {
        return this.responderAsignacionUseCase.execute(body);
    }

    async iniciar(trasladoId: number) {
        return this.iniciarTrasladoUseCase.execute({ trasladoId });
    }

    async completar(trasladoId: number) {
        return this.completarTrasladoUseCase.execute({ trasladoId });
    }

    async cancelar(body: CancelarTrasladoDTO) {
        return this.cancelarTrasladoUseCase.execute(body);
    }

    async getById(id: number) {
        return this.trasladoRepository.findById(id);
    }

    async getByCliente(clienteId: number) {
        return this.trasladoRepository.findByClienteId(clienteId);
    }

    async getByChofer(choferId: number) {
        return this.trasladoRepository.findByChoferId(choferId);
    }
}