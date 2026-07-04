-- Objetivos de modulo
--Responder preguntas como:

--¿Cuánto dinero ha generado la plataforma?
--¿Qué cliente ha realizado más viajes?
--¿Qué chofer realizó más traslados?
--¿Qué vehículo trabaja más?
--¿Cuál es el promedio de costo por viaje?
--¿Cuál es el ingreso total?
--¿Cuál es el porcentaje de viajes finalizados?

--REPORTE 1
--Ranking de clientes por cantidad de traslados realizados
--Objetivo: Identificar los clientes más activos de la plataforma. 

SELECT u.id_usuario, u.nombre, u.apellido, COUNT (t.id_traslado) AS total_traslados FROM usuario u 
INNER JOIN cliente  c ON u.id_usuario = c.id_usuario 
INNER JOIN traslado t ON c.id_usuario = t.id_cliente

GROUP BY u.id_usuario, u.nombre, u.apellido ORDER BY total_traslados DESC; 


-- REPORTE 2
-- Clientes que más dinero han gastado

SELECT u.nombre,  u.apellido,

    SUM(t.costo_estimado) AS dinero_gastado

FROM usuario u

INNER JOIN cliente c ON u.id_usuario = c.id_usuario

INNER JOIN traslado t ON c.id_usuario = t.id_cliente

GROUP BY u.nombre, u.apellido ORDER BY dinero_gastado DESC;

-- REPORTE 3
-- Ranking de choferes

SELECT u.nombre, u.apellido,

    COUNT(t.id_traslado) AS viajes_realizados

FROM usuario u

INNER JOIN chofer c ON u.id_usuario = c.id_usuario

INNER JOIN traslado t ON c.id_usuario = t.id_chofer

GROUP BY  u.nombre, u.apellido ORDER BY viajes_realizados DESC;

-- ==========================================================
-- REPORTE 4
-- Ingreso económico generado por chofer
-- ==========================================================

SELECT  u.nombre, u.apellido,

    SUM(t.costo_estimado) AS ingreso_generado

FROM usuario u

INNER JOIN chofer c ON u.id_usuario = c.id_usuario

INNER JOIN traslado t ON c.id_usuario = t.id_chofer

GROUP BY u.nombre, u.apellido ORDER BY ingreso_generado DESC;

-- REPORTE 5
-- Vehículos más utilizados

SELECT v.placa, m.nombre AS marca, v.modelo,

    COUNT(t.id_traslado) AS cantidad_viajes

FROM vehiculo v

INNER JOIN marca m ON v.id_marca = m.id_marca

INNER JOIN traslado t ON v.id_vehiculo = t.id_vehiculo

GROUP BY v.placa, m.nombre, v.modelo ORDER BY cantidad_viajes DESC;

-- REPORTE 7
-- Costo promedio por traslado

SELECT

AVG(costo_estimado) AS promedio_por_viaje

FROM traslado WHERE estado_actual='FINALIZADO';

-- REPORTE 8
-- Viaje más costoso registrado

SELECT * FROM traslado ORDER BY costo_estimado DESC LIMIT 1;

-- REPORTE 9
-- Distribución de estados de traslado

SELECT estado_actual,

COUNT(*) AS cantidad

FROM traslado GROUP BY estado_actual;

SELECT COUNT(*) AS clientes FROM cliente;

SELECT COUNT(*) AS choferes FROM chofer;

SELECT COUNT(*) AS vehiculos FROM vehiculo;

SELECT COUNT(*) AS wallets FROM wallet;

