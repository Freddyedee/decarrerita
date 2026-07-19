-- ==========================================
-- 2. SEED DE CLIENTES
-- ==========================================
WITH nuevo_cliente_1 AS (
    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Cliente'), 
        'Freddy', 'Marcano', 'freddy@gmail.com', '04249545985', '@dRXEE@@X', 'activo'
    )
    RETURNING id_usuario
)
INSERT INTO cliente (id_usuario, rating_promedio) 
SELECT id_usuario, 5.00 FROM nuevo_cliente_1;

WITH nuevo_cliente_2 AS (
    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Cliente'), 
        'Alejandro', 'Marcano', 'alejandro@gmail.com', '04249545986', '@dRXEE@@X', 'activo'
    )
    RETURNING id_usuario
)
INSERT INTO cliente (id_usuario, rating_promedio) 
SELECT id_usuario, 5.00 FROM nuevo_cliente_2;

-- NOTA: Asumo que tu Trigger en la BD se encarga de crear la Wallet al insertar el Cliente/Usuario.
-- Si el Trigger NO lo hace, descomenta esto para rellenar los saldos:
/*
INSERT INTO wallet (id_usuario, saldo_disponible, moneda)
SELECT id_usuario, 50.00, 'USD' FROM usuario WHERE email IN ('freddy@gmail.com', 'alejandro@gmail.com');
*/