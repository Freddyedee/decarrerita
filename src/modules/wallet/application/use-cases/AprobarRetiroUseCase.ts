import { ISolicitudRetiroRepository } from "../../domain/ports/ISolicitudRetiroRepository";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";

export class AprobarRetiroUseCase {
    constructor(
        private readonly walletService: any,
        private readonly solicitudRetiroRepo: ISolicitudRetiroRepository,
        private readonly transactionManager: ITransactionManager
    ) {}

    async execute(solicitudId: number) {
        if (!solicitudId || isNaN(solicitudId)) {
            throw new Error("ID de solicitud inválido.");
        }

        return await this.transactionManager.run(async (tx) => {
            return await this.walletService.aprobarRetiro(
                solicitudId,
                this.solicitudRetiroRepo,
                tx
            );
        });
    }
}