import { Wallet } from "../../domain/entities/Wallet";
import { wallet as PrismaWallet } from "@prisma/client";

export class walletMapper {

    static toDomain(raw: PrismaWallet): Wallet {
        return new Wallet(
            raw.id_wallet, 
            raw.id_usuario, 
            Number(raw.saldo_disponible), 
            Number(raw.saldo_congelado), 
            raw.estado_bloqueo, 
            raw.moneda, 
            raw.fecha_creacion
        ); 
    }

    static toPersistence (wallet: Wallet){ 

        return {
            id_wallet:        wallet.id,
            id_usuario:       wallet.usuarioId,
            saldo_disponible: wallet.saldoDisponible, 
            saldo_congelado:  wallet.saldoCongelado,
            estado_bloqueo:   wallet.estadoBloqueo,
            moneda:           wallet.moneda
        };
    }
}