export interface SolicitarRecargaRequest {

    usuarioId: number;

    bancoId: number;

    monto: number;

    referenciaPago: string;

}

export interface RecargaResponse {

    id: number;

    walletId: number;

    bancoId: number;

    monto: number;

    referenciaPago: string;

    status: string;

    fechaSolicitud: Date;

    fechaAprobacion: Date | null;

}

export interface WalletBalanceResponse {

    walletId: number;

    usuarioId: number;

    saldoDisponible: number;

    saldoCongelado: number;

    bloqueada: boolean;

    moneda: string;

}

export interface BancoResponse {

    id: number;

    nombre: string;

    codigo: string;

    activo: boolean;

}