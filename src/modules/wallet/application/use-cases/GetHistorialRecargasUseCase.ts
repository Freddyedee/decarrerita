import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { IRecargaRepository } from "../../domain/ports/IRecargaRepository";
import { RecargaResponse } from "../dto/WalletClientDTOs";
import { Recarga } from "../../domain/entities/Recarga";

export class GetHistorialRecargasUseCase {

    constructor(

        private readonly walletRepository: IWalletRepository,

        private readonly recargaRepository: IRecargaRepository

    ) {}

    async execute(usuarioId: number): Promise<RecargaResponse[]> {

        const wallet = await this.walletRepository.findByUsuarioId(usuarioId);

        if (!wallet) {
            throw new Error("Wallet not found for this user.");
        }

        const recargas = await this.recargaRepository.findByWalletId(wallet.id);

        return recargas.map((recarga: Recarga) => ({

            id: recarga.id!,

            walletId: recarga.walletId,

            bancoId: recarga.bancoId,

            monto: recarga.getMonto(),

            referenciaPago: recarga.getReferenciaPago(),

            status: recarga.getStatus(),

            fechaSolicitud: recarga.fechaSolicitud,

            fechaAprobacion: recarga.fechaAprobacion

        }));

    }

}