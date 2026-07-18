import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { IRecargaRepository } from "../../domain/ports/IRecargaRepository";
import { IBancoRepository } from "../../domain/ports/IBancoRepository";

import { Recarga } from "../../domain/entities/Recarga";
import { EstadoRecarga } from "../../domain/enums/EstadoRecarga";

import { SolicitarRecargaRequest, RecargaResponse } from "../dto/WalletClientDTOs";

/**
 * ============================================================
 * SolicitarRecargaUseCase
 * ============================================================
 *
 * El cliente declara que hizo una transferencia bancaria a la
 * cuenta de la empresa. RN-032: esto NO acredita saldo de
 * inmediato — solo dispara la recarga con `estado = PENDIENTE`.
 * El saldo se acredita después, cuando personal administrativo
 * verifica y aprueba la recarga (flujo de aprobación fuera del
 * alcance de esta iteración — la pantalla de cliente solo cubre
 * la declaración, no la verificación).
 *
 * Se diseñó así, en vez de acreditar directo, porque confiar
 * ciegamente en un número de referencia escrito por el cliente
 * permitiría inflar saldo sin haber transferido dinero real.
 *
 * ============================================================
 */
export class SolicitarRecargaUseCase {

    constructor(

        private readonly walletRepository: IWalletRepository,

        private readonly recargaRepository: IRecargaRepository,

        private readonly bancoRepository: IBancoRepository

    ) {}

    async execute(
        request: SolicitarRecargaRequest
    ): Promise<RecargaResponse> {

        // 1. La wallet del cliente debe existir (la crea el
        //    trigger de BD al registrarse — ver CreateUserUseCase).
        const wallet = await this.walletRepository.findByUsuarioId(
            request.usuarioId
        );

        if (!wallet) {
            throw new Error("Wallet not found for this user.");
        }

        // 2. El banco debe existir y estar activo — no tiene
        //    sentido aceptar una recarga hacia un banco que la
        //    empresa ya no usa.
        const banco = await this.bancoRepository.findById(request.bancoId);

        if (!banco || !banco.activo) {
            throw new Error("Bank not found or inactive.");
        }

        const recarga = new Recarga(
            null,
            wallet.id,
            request.bancoId,
            request.monto,
            request.referenciaPago,
            EstadoRecarga.PENDIENTE,
            new Date(),
            null
        );

        const saved = await this.recargaRepository.create(recarga);

        return {

            id: saved.id!,

            walletId: saved.walletId,

            bancoId: saved.bancoId,

            monto: saved.getMonto(),

            referenciaPago: saved.getReferenciaPago(),

            status: saved.getStatus(),

            fechaSolicitud: saved.fechaSolicitud,

            fechaAprobacion: saved.fechaAprobacion

        };

    }

}