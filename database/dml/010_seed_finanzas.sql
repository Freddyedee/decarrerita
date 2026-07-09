BEGIN;

WITH datos_wallet AS (

    SELECT id_wallet, saldo_disponible FROM wallet WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE email = 'freddy@gmail.com')

),

insercion AS (
    INSERT INTO movimiento_wallet (
        id_wallet, id_traslado, tipo_movimiento, monto, saldo_anterior, saldo_posterior, descripcion
    )
    SELECT 
        id_wallet, 
        1, -- ID del traslado
        'PAGO_TRASLADO', 
        -15.00, 
        saldo_disponible, 
        saldo_disponible - 15.00, 
        'Pago por traslado ID 1'
    FROM datos_wallet
    RETURNING id_wallet, saldo_posterior
) 

UPDATE wallet 
SET saldo_disponible = (SELECT saldo_posterior FROM insercion)
WHERE id_wallet = (SELECT id_wallet FROM insercion);


COMMIT;


-- Verifica que el saldo en la tabla wallet haya cambiado
SELECT saldo_disponible FROM wallet WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE email = 'freddy@gmail.com');


-- Verifica que el movimiento quedó registrado con el cálculo correcto
SELECT * FROM movimiento_wallet ORDER BY fecha_movimiento DESC LIMIT 1;

SELECT * FROM vehiculo;
DELETE FROM vehiculo WHERE id_vehiculo = 0;

SELECT * from marca; 
SELECT id_marca, nombre FROM marca ORDER BY id_marca;

SELECT * FROM tarifa; 

select * from usuario; 
select * from wallet