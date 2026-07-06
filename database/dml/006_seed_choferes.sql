-- SEED DE CHOFERES
-- Objetivo: Crear usuarios con rol 'Chofer', su perfil especializado, 
-- su wallet y su primer vehículo asignado. 

BEGIN;

WITH nuevo_usuario AS (
    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Chofer'), 
        'Alonso', 'Alonso', 'Alonso@chofer.com', '04249545987', 'hash_Alonso_789', 'activo'
    )
    RETURNING id_usuario
),
nuevo_chofer AS (
    INSERT INTO chofer (id_usuario, licencia, estado_aprobacion)
    SELECT id_usuario, 'LIC-5588', 'aprobado' FROM nuevo_usuario
    RETURNING id_usuario
)
-- Eliminamos el bloque 'nueva_wallet' porque el trigger lo hace solo
INSERT INTO vehiculo (id_marca, id_chofer, placa, modelo, color, annio, capacidad_pasajeros, estado)
SELECT 
    (SELECT id_marca FROM marca WHERE nombre = 'Ford'),
    id_usuario, 
    'ABC-4477', 
    'Mustang', 
    'Blanco', 
    2020, 
    2, 
    'activo'
FROM nuevo_chofer;

COMMIT;

select * from chofer;
select * from vehiculo

-- Esto borra todos los datos y resetea todos los contadores de las tablas a 1
TRUNCATE TABLE vehiculo, wallet, chofer, usuario RESTART IDENTITY CASCADE;