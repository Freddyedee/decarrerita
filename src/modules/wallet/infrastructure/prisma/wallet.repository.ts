// infrastructure/prisma/wallet.repository.ts

import { prisma } from "@/shared/lib/prisma";
import { Wallet } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { walletMapper } from "./wallet.mapper";
import { Prisma } from "@prisma/client";

export class WalletRepository implements IWalletRepository {

    async findByUsuarioId(usuarioId: number, tx?: Prisma.TransactionClient): Promise<Wallet | null> {

        const client = tx ?? prisma; 
        const wallet = await client.wallet.findUnique({
            where: { id_usuario: usuarioId }
        });

        return wallet ? walletMapper.toDomain(wallet) : null;
    }

    /**
     * Actualiza el saldo Y registra el movimiento en una sola
     * transacción de Prisma — si algo falla a mitad de camino,
     * ninguna de las dos escrituras queda aplicada. Esto evita
     * que un saldo cambie sin su registro de auditoría correspondiente.
     */
    async updateWithMovement(
        wallet: Wallet,
        tipoMovimiento: string,
        monto: number,
        saldoAnterior: number,
        trasladoId: number | null,
        descripcion: string, 
        tx?: Prisma.TransactionClient

    ): Promise<Wallet> {

        const client = tx ?? prisma;    // Operador de coalescencia nula. Este le dice al repository "si me proporcionaron una transsaccion tx usula
                                        // caso contrario null o undefined, usa el cliente de prisma por defecto" 

        const updated = await client.wallet.update({
            where: { id_wallet: wallet.id}, 
            data: {saldo_disponible: wallet.saldoDisponible}
        })

        await client.movimiento_wallet.create({

            data: {
                id_wallet: wallet.id, id_traslado: trasladoId, 
                tipo_movimiento: tipoMovimiento, monto, 
                saldo_anterior: saldoAnterior, saldo_posterior: wallet.saldoDisponible,
                descripcion
            }
        }); 
    
        return walletMapper.toDomain(updated);
    }
}