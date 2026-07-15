// modules/traslado/domain/repositories/IWalletService.ts
//
// Puerto que Traslados usa para mover dinero, sin conocer
// la implementación del módulo Wallet.

import { Prisma } from "@prisma/client";

export interface IWalletService {

    
    //2. Al añadir el parametro de transaccion al metodo de debitar extendemos el alcance de la transaccion. d eesta manera tanto 
    //   El repositorio de Traslados como el Servicio de Wallets son 'consistentes' de que pueden trabajar dentro de una transaccion compartida

    /**
     * 
     * @param clienteId 
     * 
     * @param monto 
     * @param trasladoId 
     * @param tx 
     * 
     *  - Sincronizamos totalmente los bloques. Cuando se inicia el caso de uso el cliente Tx generado se propaga a traves de todos los metodos
     *  - Falla: en caso de walletService.debitarCliente falla (cliente sin saldo), el transactionClient no hace commit (base de datos). De esta menra la operacion se aborta
     *           y no se ejecuta el trasladoRepository.  
     * 
     */
    debitarCliente(clienteId: number, monto: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void>;

    creditarChofer(choferId: number, monto: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void>;

    /** Ver Hueco 1: registra la comisión retenida por la empresa. */
    //registrarComision(monto: number, trasladoId: number): Promise<void>;

    /** Ver Hueco 2: para cancelaciones después de EN_CURSO. */
    //reembolsarCliente(clienteId: number, monto: number, trasladoId: number): Promise<void>;

    aplicarPenalizacion(usuarioId: number, monto: number, trasladoId: number, motivo: string, tx?: Prisma.TransactionClient): Promise<void>;

    reembolsarConPenalizacion( clienteId: number, montoTotal: number, penalizacion: number, trasladoId: number, tx?: Prisma.TransactionClient): Promise<void>;

     /**
     * RN-025: verifica si un usuario puede iniciar una nueva
     * operación económica (solicitar viaje, aceptar viaje).
     * Devuelve false si su wallet está bloqueada o en saldo
     * negativo por una penalización pendiente de regularizar.
     */
    puedeOperar(usuarioId: number): Promise<boolean>;


}