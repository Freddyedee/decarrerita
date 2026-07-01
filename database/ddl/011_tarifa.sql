CREATE TABLE tarifa (
    id_tarifa SERIAL PRIMARY KEY,
    precio_km DECIMAL(12,2) NOT NULL,
    tarifa_base DECIMAL(12,2) NOT NULL,
    tarifa_cancelacion DECIMAL(12,2) NOT NULL,
    porcentaje_comision DECIMAL(5,2) NOT NULL,
    fecha_inicio_vigencia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin_vigencia TIMESTAMP DEFAULT NULL
);