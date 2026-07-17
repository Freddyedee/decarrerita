import { Prisma } from "@prisma/client";
import { Wallet } from "../entities/Wallet";

export interface IWalletRepository {

    findByUsuarioId(usuarioId: number, tx?: Prisma.TransactionClient ): Promise <Wallet | null>

    /**
     * Persiste el nuevo saldo Y registra el movimiento en
     * movimiento_wallet (saldo_anterior, saldo_posterior),
     * de forma atómica. La implementación real usa una
     * transacción de Prisma para garantizar que ambas
     * escrituras ocurran juntas o ninguna.
     */

    updateWithMovement(
        wallet : Wallet, 
        tipoMovimiento: string, 
        monto: number, 
        saldoAnterior: number,
        trasladoId: number | null, 
        descripcion: string, 
        tx?: Prisma.TransactionClient

    ): Promise <Wallet>; 


    calcularCambioNetoSaldo(usuarioId: number, desde: Date, hasta: Date): Promise<number>; 

}