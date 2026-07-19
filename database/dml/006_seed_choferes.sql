-- ==========================================
-- 3. SEED DE CHOFERES
-- ==========================================
WITH nuevo_usuario_chofer AS (
    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Chofer'), 
        'Alonso', 'Alonso', 'Alonso@chofer.com', '04249545987', 'hash_Alonso_789', 'activo'
    )
    RETURNING id_usuario
),
nuevo_chofer AS (
    -- NOTA: id_banco y numero_cuenta quedarán en NULL automáticamente
    INSERT INTO chofer (id_usuario, licencia, estado_aprobacion)
    SELECT id_usuario, 'LIC-5588', 'aprobado' FROM nuevo_usuario_chofer
    RETURNING id_usuario
)
-- Asignación del vehículo al Chofer
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


