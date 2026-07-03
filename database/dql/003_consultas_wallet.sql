--Objetivo del modulo: Consultas relacionadas con la wallet de los usuarios, tanto clientes como choferes.
--Responde preguntas como: 
--¿Cuánto dinero tiene cada usuario?
--¿Qué usuarios tienen más saldo?
--¿Qué movimientos ha realizado una billetera?
--¿Cuánto dinero ha ingresado al sistema?
--¿Cuánto dinero salió?
--¿Cuál fue el último movimiento?
--¿Qué usuario realizó un pago?
--¿Cuánto dinero movió cada usuario?


--Consulta 1: Obtener todas las wallets registradas en el sistema.
--Objetivo: Visualizar todas las wallets registradas en el sistema, tanto de clientes como de choferes.
SELECT * FROM wallet;

--Consulta 1: Obtener todas las wallets registradas en el sistema.
--Objetivo: Visualizar todas las wallets registradas en el sistema, tanto de clientes como de choferes.
SELECT id_usuario, id_wallet, saldo_disponible ,saldo_congelado, estado_bloqueo, moneda, fecha_creacion FROM wallet; 

--Consulta 2: Obtener las wallets con nombre de usuario
--Objetivo: Visualizar las wallets junto con el nombre y apellido del usuario al que pertenecen.
SELECT w.id_wallet, u.id_usuario ,u.nombre, u.apellido, w.saldo_disponible, w.saldo_congelado, w.estado_bloqueo, w.moneda FROM wallet w INNER JOIN usuario u ON u.id_usuario = w.id_usuario;

--Consulta 3
--Objetivo: Visualizar los usuarios que tienen saldo disponible en sus wallets, ordenados de mayor a menor saldo.

SELECT u.apellido, u.nombre, w.saldo_disponible FROM wallet w INNER JOIN usuario u ON u.id_usuario = w.id_wallet WHERE w.saldo_disponible > 0 ORDER BY w.saldo_disponible DESC; 

-- CONSULTA 4
-- Historial completo de movimientos

SELECT id_movimiento, id_wallet, tipo_movimiento, monto, saldo_anterior, saldo_posterior, descripcion, fecha_movimiento FROM movimiento_wallet ORDER BY fecha_movimiento DESC;


--Consulta 5
--Objetivo: MOvimientos asociados al usuario 

SELECT u.nombre, u.apellido, mw.tipo_movimiento, mw.monto, mw.saldo_anterior, mw.saldo_posterior, mw.fecha_movimiento FROM movimiento_wallet mw 
INNER JOIN wallet w ON mw.id_wallet = w.id_wallet
INNER JOIN usuario u ON u.id_usuario = w.id_usuario
ORDER BY mw.fecha_movimiento DESC; 

--Consulta 6
--objetivo: Movimientos correspondientes a pagos

SELECT id_movimiento, monto, descripcion, fecha_movimiento FROM movimiento_wallet WHERE tipo_movimiento = 'PAGO_TRASLADO' ORDER BY fecha_movimiento DESC;

--BLOQUE 3 Consultas financieras

--Consulta 7
-- Dinero disponible en todas las wallets
SELECT SUM (saldo_disponible) AS total_saldo_cuenta FROM wallet; 

--Consulta 8
-- Dinero promedio en todas las wallets

SELECT AVG (saldo_disponible) AS promedio_saldo_cuenta FROM wallet;

--Consulta 9
-- Usuario con mayor saldo disponible en su wallet

SELECT u.nombre, u.apellido, w.id_wallet, w.saldo_disponible FROM wallet w INNER JOIN usuario u ON u.id_usuario = w.id_usuario ORDER BY w.saldo_disponible DESC LIMIT 1; 


--bloque 4. Consultas estadisticas 

-- CONSULTA 10
-- Número de movimientos por categoría

SELECT tipo_movimiento, 

COUNT(*) AS cantidad 

FROM movimiento_wallet GROUP BY tipo_movimiento;

-- CONSULTA 11
-- Total monetario por tipo de movimiento

SELECT  tipo_movimiento,

SUM(monto) AS total

FROM movimiento_wallet GROUP BY tipo_movimiento;

-- CONSULTA 12
-- Número total de wallets

SELECT

COUNT(*) AS total_wallets

FROM wallet;

--Bloque 5. Reportes 

-- CONSULTA 13
-- Ranking de usuarios por saldo disponible

SELECT u.nombre, u.apellido, w.saldo_disponible FROM wallet w INNER JOIN usuario u ON w.id_usuario=u.id_usuario ORDER BY w.saldo_disponible DESC;

-- CONSULTA 14
-- Últimos cinco movimientos financieros

SELECT id_movimiento, tipo_movimiento, monto, fecha_movimiento FROM movimiento_wallet ORDER BY fecha_movimiento DESC LIMIT 5;