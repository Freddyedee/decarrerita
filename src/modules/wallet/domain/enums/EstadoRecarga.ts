// domain/enums/EstadoRecarga.ts

/**
 * RN-032: una recarga NO acredita saldo al crearse. Nace
 * PENDIENTE (el cliente solo está declarando "hice esta
 * transferencia") y solo pasa a APROBADA — momento en que
 * SÍ se acredita la wallet — cuando el personal administrativo
 * verifica que el dinero realmente llegó a la cuenta de la
 * empresa. Este enum modela ese ciclo de vida; ver
 * SolicitarRecargaUseCase para el porqué de esta separación.
 */
export enum EstadoRecarga {
    PENDIENTE = "PENDIENTE",
    APROBADA = "APROBADA",
    RECHAZADA = "RECHAZADA"
}