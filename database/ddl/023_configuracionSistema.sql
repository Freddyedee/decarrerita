CREATE TABLE configuracion_sistema (
    id_configuracion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE, -- Nombre clave: 'PORCENTAJE_COMISION', 'NOTA_MINIMA_PSICOLOGICA'
    valor VARCHAR(255) NOT NULL,         -- El valor configurado: '0.30', '73'
    descripcion TEXT NOT NULL,           -- Para qué sirve este parámetro
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 

select * from traslado; 
SELECT * FROM movimiento_wallet;

select  * from wallet 

select * from usuario ; 

UPDATE wallet SET saldo_disponible = 150 WHERE id_usuario = 5;

SELECT * FROM movimiento_wallet WHERE id_wallet = 6 ORDER BY fecha_movimiento DESC LIMIT 5;

