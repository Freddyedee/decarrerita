export interface SolicitudRetiroInput {
    walletId: number;
    bancoId: number;
    monto: number;
    numeroCuenta: string;
    titularCuenta: string;
    estado?: string;
}

export interface ISolicitudRetiroRepository {
    create(data: SolicitudRetiroInput, tx?: any): Promise<any>;
    findById(id: number, tx?: any): Promise<any>;
    findByWalletId(walletId: number): Promise<any[]>;
    findPendientes(): Promise<any[]>;
    updateEstado(id: number, nuevoEstado: string, tx?: any): Promise<any>;
}