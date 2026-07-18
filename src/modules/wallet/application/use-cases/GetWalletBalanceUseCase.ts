import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { WalletBalanceResponse } from "../dto/WalletClientDTOs";

export class GetWalletBalanceUseCase {

    constructor(
        private readonly walletRepository: IWalletRepository
    ) {}

    async execute(usuarioId: number): Promise<WalletBalanceResponse> {

        const wallet = await this.walletRepository.findByUsuarioId(usuarioId);

        if (!wallet) {
            throw new Error("Wallet not found for this user.");
        }

        return {

            walletId: wallet.id,

            usuarioId: wallet.usuarioId,

            saldoDisponible: wallet.saldoDisponible,

            saldoCongelado: wallet.saldoCongelado,

            bloqueada: wallet.estadoBloqueo,

            moneda: wallet.moneda

        };

    }

}