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



select * from rol;

select * from chofer ; 

UPDATE usuario SET password_hash = '$2b$10$APydaS9RVITTo9wbNmxZzOxfg5GS80kM/jPK81HSccw9Gym3pr2re' WHERE id_usuario = 3;
UPDATE usuario SET password_hash = '$2b$10$zgcCcDiN3P/2DU0jAvNDDOyPADYoqGNjd.HoKgohI14qekyJcbCua' WHERE id_usuario = 1;
SELECT * FROM "usuario" WHERE "email" = 'Alonso@chofer.com';
SELECT * FROM movimiento_wallet WHERE id_wallet = 6 ORDER BY fecha_movimiento DESC LIMIT 5;

UPDATE usuario SET email = LOWER(email); apellido;

select * from chofer; 


select * from revision_vehicular;

select * from vehiculo

select * from evaluacion_psicologica

select * from vehiculo;
select * from usuario;
select * from contacto_emergencia;
select * from banco; 

INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
VALUES (
    (SELECT id_rol FROM rol WHERE nombre = 'Chofer'), 
    'Chofer', 
    'Principal', 
    'chofer@decarrerita.com', 
    '04148761470', 
    '$2b$10$GkTtWsRjKgrpGngkigI.eepWcHCfkzDAUUzraijFGb.XE3.3b6lA2', -- Ej: '$2b$10$w8T.N0b3...'
    'activo'
);

