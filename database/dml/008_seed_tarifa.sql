-- Insertar una tarifa base para pruebas
INSERT INTO tarifa (
    precio_km, 
    tarifa_base, 
    tarifa_cancelacion, 
    porcentaje_comision, 
    fecha_inicio_vigencia
) VALUES (
    1.50,   -- precio por kilometro
    2.00,   -- tarifa base de arranque
    1.00,   -- costo por cancelar
    0.15,   -- 15% de comisión para la empresa
    CURRENT_TIMESTAMP
);