// infrastructure/prisma/wallet.repository.ts

import { prisma } from "@/shared/lib/prisma";
import { Wallet } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/ports/IWalletRepository";
import { walletMapper } from "./wallet.mapper";
import { DireccionMovimiento } from "../../domain/enums/DireccionMovimiento";
import { Prisma } from "@prisma/client";



export class WalletRepository implements IWalletRepository {

    async findByUsuarioId(usuarioId: number, tx?: Prisma.TransactionClient): Promise<Wallet | null> {

        const client = tx ?? prisma; 
        const wallet = await client.wallet.findUnique({
            where: { id_usuario: usuarioId }
        });

        return wallet ? walletMapper.toDomain(wallet) : null;
    }

    async findById(id: number, tx?: Prisma.TransactionClient): Promise<Wallet | null> {
        const client = tx ?? prisma; 
        const wallet = await client.wallet.findUnique({
            where: { id_wallet: id } // Buscamos directamente por id_wallet
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

        console.log("=== UPDATE WITH MOVEMENT ===");
        console.log("wallet.id:", wallet.id);
        console.log("wallet.saldoDisponible que se va a persistir:", wallet.saldoDisponible);

        const updated = await client.wallet.update({
            where: { id_wallet: wallet.id}, 
            data: {saldo_disponible: wallet.saldoDisponible}
        })

        console.log("valor que Postgres devolvió tras el update:", updated.saldo_disponible);


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

    /**
     * ============================================================
     * ÚNICO LUGAR DEL PROYECTO CON SQL CRUDO ($queryRaw)
     * ============================================================
     *
     * Por qué: Prisma no permite comparar dos columnas entre sí
     * (ej. "saldo_posterior > saldo_anterior") en su API estándar
     * `where` — solo compara una columna contra un valor fijo.
     * Como `movimiento_wallet` no tiene una columna que indique
     * directamente si el movimiento fue de entrada o salida, se
     * deriva comparando los dos saldos, lo cual solo es posible
     * con SQL directo.
     *
     * Seguridad: se usa el template literal de Prisma
     * (prisma.$queryRaw`...`), que parametriza automáticamente
     * los valores interpolados — nunca concatenar strings a mano
     * aquí (eso abriría la puerta a inyección SQL).
     * ============================================================
     */

    private async sumOfDirection( usuarioId: number, direccion: DireccionMovimiento, from: Date, until: Date): Promise <number> { 
        const wallet = await prisma.wallet.findUnique ( { where: { id_usuario: usuarioId }}); 
        if(!wallet) return 0; 


        // El operador de comparación es lo único que cambia según
        // la dirección — por eso ambos métodos públicos comparten
        // este único query.

        const comparador = direccion === DireccionMovimiento.ENTRADA
            ? Prisma.sql `saldo_posterior > saldo_anterior`
            : Prisma.sql `saldo_posterior < saldo_anterior`; 
            
            const resultado = await prisma.$queryRaw<{ total : number | null}[]> 
            `
            SELECT SUM(monto) as total
            FROM movimiento_wallet
            WHERE id_wallet = ${wallet.id_wallet}
                AND tipo_movimiento = 'PAGO_TRASLADO'
                AND fecha_movimiento BETWEEN ${from} AND ${until}
                AND ${comparador}
            `; 


            return Number(resultado[0]?.total ?? 0); 
    }

    //  nadie que consuma este repository necesita saber que "entrada"/"salida"

    // existen; solo ven "recibidos"/"enviados".

    /**
    * Calcula el cambio neto de saldo de una wallet durante un
    * período, sin importar qué tipos de movimiento ocurrieron.
    */

    async calcularCambioNetoSaldo(usuarioId: number, desde: Date, hasta: Date): Promise<number> {

    const wallet = await prisma.wallet.findUnique({ where: { id_usuario: usuarioId } });
    if (!wallet) return 0;

    // El saldo ANTES del período: el saldo_posterior del último
    // movimiento ocurrido justo antes de "desde".
    const ultimoAntes = await prisma.movimiento_wallet.findFirst({
        where: { id_wallet: wallet.id_wallet, fecha_movimiento: { lt: desde } },
        orderBy: { fecha_movimiento: "desc" }
    });

    // El saldo AL FINAL del período: el saldo_posterior del
    // último movimiento ocurrido dentro del rango.
    const ultimoDentro = await prisma.movimiento_wallet.findFirst({
        where: { id_wallet: wallet.id_wallet, fecha_movimiento: { gte: desde, lte: hasta } },
        orderBy: { fecha_movimiento: "desc" }
    });

    const saldoInicio = ultimoAntes ? Number(ultimoAntes.saldo_posterior) : 0;
    const saldoFin = ultimoDentro ? Number(ultimoDentro.saldo_posterior) : saldoInicio;

    return saldoFin - saldoInicio;
}


    

    
}