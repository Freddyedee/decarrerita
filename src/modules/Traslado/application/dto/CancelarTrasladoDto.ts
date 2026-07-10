export type ActorCancelacion = "CLIENTE" | "CHOFER";

export interface CancelarTrasladoDTO {
    trasladoId: number;
    actorId: number;           // id del cliente o chofer que cancela
    actorRole: ActorCancelacion;
    motivo: string;
}