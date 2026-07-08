// infrastructure/prisma/tarifa.mapper.ts

import { Tarifa } from "../../domain/entities/Tarifa";
import { tarifa as PrismaTarifa } from "@prisma/client";

export class tarifaMapper {

    static toDomain(raw: PrismaTarifa): Tarifa {
        return new Tarifa(
            raw.id_tarifa,
            Number(raw.precio_km),
            Number(raw.tarifa_base),
            Number(raw.tarifa_cancelacion),
            Number(raw.porcentaje_comision),
            raw.fecha_inicio_vigencia,
            raw.fecha_fin_vigencia
        );
    }

    static toPersistence(tarifa: Tarifa) {
        return {
            id_tarifa:             tarifa.id,
            precio_km:             tarifa.precioKm,
            tarifa_base:           tarifa.tarifaBase,
            tarifa_cancelacion:    tarifa.tarifaCancelacion,
            porcentaje_comision:   tarifa.porcentajeComision,
            fecha_inicio_vigencia: tarifa.fechaInicioVigencia,
            fecha_fin_vigencia:    tarifa.fechaFinVigencia
        };
    }
}