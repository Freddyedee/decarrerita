import { Traslado } from "../../domain/entities/Traslado";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";
import { traslado as PrismaTraslado } from "@prisma/client";

export class trasladoMapper {

    static toDomain(raw: PrismaTraslado): Traslado {
        return new Traslado(
            raw.id_traslado,
            raw.id_cliente,
            raw.id_chofer,
            raw.id_vehiculo,
            raw.id_tarifa,
            Number(raw.origen_latitud),
            Number(raw.origen_longitud),
            Number(raw.destino_latitud),
            Number(raw.destino_longitud),
            Number(raw.distancia_estimada_km),
            Number(raw.costo_estimado),
            raw.estado_actual as EstadoTraslado,
            raw.fecha_solicitud
        );
    }

    static toPersistence(traslado: Traslado) {
        return {
            id_traslado:           traslado.id,
            id_cliente:            traslado.clienteId,
            id_chofer:             traslado.choferId,
            id_vehiculo:           traslado.vehiculoId,
            id_tarifa:             traslado.tarifaId,
            origen_latitud:        traslado.origenLat,
            origen_longitud:       traslado.origenLng,
            destino_latitud:       traslado.destinoLat,
            destino_longitud:      traslado.destinoLng,
            distancia_estimada_km: traslado.distanciaEstimadaKm,
            costo_estimado:        traslado.costoEstimado,
            estado_actual:         traslado.estadoActual,
            fecha_solicitud:       traslado.fechaSolicitud
        };
    }
}