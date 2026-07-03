INSERT INTO configuracion_sistema (nombre, valor, descripcion)
VALUES 

(
    'tarifa_base', '1.5', 'Tarifa base por kilómetro'
),
(
    'comision_plataforma', '0.15', 'Comisión del sistema por viaje'
),
(
    'tiempo_espera_max', '5', 'Minutos máximos de espera del cliente'
),
(
    'moneda', 'USD', 'Moneda del sistema'
);

select * from configuracion_sistema; 