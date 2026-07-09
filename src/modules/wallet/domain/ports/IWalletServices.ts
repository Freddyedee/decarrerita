// modules/traslado/domain/repositories/IWalletService.ts
//
// Puerto que Traslados usa para mover dinero, sin conocer
// la implementación del módulo Wallet.

export interface IWalletService {

    debitarCliente(clienteId: number, monto: number, trasladoId: number): Promise<void>;

    creditarChofer(choferId: number, monto: number, trasladoId: number): Promise<void>;

    /** Ver Hueco 1: registra la comisión retenida por la empresa. */
    //registrarComision(monto: number, trasladoId: number): Promise<void>;

    /** Ver Hueco 2: para cancelaciones después de EN_CURSO. */
    //reembolsarCliente(clienteId: number, monto: number, trasladoId: number): Promise<void>;

    aplicarPenalizacion(usuarioId: number, monto: number, trasladoId: number, motivo: string): Promise<void>;

    reembolsarConPenalizacion( clienteId: number, montoTotal: number, penalizacion: number, trasladoId: number ): Promise<void>;
}