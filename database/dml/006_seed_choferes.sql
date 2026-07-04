-- SEED DE CHOFERES
-- Objetivo: Crear usuarios con rol 'Chofer', su perfil especializado, 
-- su wallet y su primer vehículo asignado. 

BEGIN;


WITH nuevo_usuario AS (
    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Chofer'), 
        'pedro', 'perez', 'pedro@chofer.com', '04148761470', 'hash_pedro_789', 'activo'
    )
    RETURNING id_usuario
),
nuevo_chofer AS (
    INSERT INTO chofer (id_usuario, licencia, estado_aprobacion)
    SELECT id_usuario, 'LIC-12345678', 'aprobado' FROM nuevo_usuario
    RETURNING id_usuario
),
nueva_wallet AS (
    INSERT INTO wallet (id_usuario, saldo_disponible, moneda)
    SELECT id_usuario, 0.00, 'USD' FROM nuevo_usuario
    RETURNING id_wallet
)
INSERT INTO vehiculo (id_marca, id_chofer, placa, modelo, color, annio, capacidad_pasajeros, estado)
SELECT 
    (SELECT id_marca FROM marca WHERE nombre = 'Toyota'),
    id_usuario, 
    'ABC-123', 
    'Corolla', 
    'Blanco', 
    2020, 
    4, 
    'activo'
FROM nuevo_chofer;

COMMIT;

