import { Recarga } from "../../domain/entities/Recarga";
import { EstadoRecarga } from "../../domain/enums/EstadoRecarga";
import { recarga as PrismaRecarga } from "@prisma/client";

export class recargaMapper {

    static toDomain(raw: PrismaRecarga): Recarga {

        return new Recarga(

            raw.id_recarga,

            raw.id_wallet,

            raw.id_banco,

            Number(raw.monto),

            raw.referencia_pago,

            raw.estado as EstadoRecarga,

            raw.fecha_solicitud,

            raw.fecha_aprobacion

        );

    }

}