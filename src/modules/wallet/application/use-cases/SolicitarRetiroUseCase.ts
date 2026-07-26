import { ISolicitudRetiroRepository } from "../../domain/ports/ISolicitudRetiroRepository";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";

export interface SolicitarRetiroDTO {
    usuarioId: number;
    bancoId: number;
    monto: number;
    numeroCuenta: string;
    titularCuenta: string;
}

export class SolicitarRetiroUseCase {
    constructor(
        private readonly walletService: any,
        private readonly solicitudRetiroRepo: ISolicitudRetiroRepository,
        private readonly transactionManager: ITransactionManager
    ) {}

    async execute(input: SolicitarRetiroDTO) {
        if (!input.numeroCuenta || !input.titularCuenta) {
            throw new Error("Debe proporcionar el número de cuenta y el titular para procesar el retiro.");
        }

        if (!input.bancoId || isNaN(input.bancoId)) {
            throw new Error("Debe seleccionar un banco válido.");
        }

        return await this.transactionManager.run(async (tx) => {
            return await this.walletService.congelarParaRetiro(
                input.usuarioId,
                input.monto,
                input.bancoId,
                input.numeroCuenta.trim(),
                input.titularCuenta.trim(),
                this.solicitudRetiroRepo,
                tx
            );
        });
    }
}