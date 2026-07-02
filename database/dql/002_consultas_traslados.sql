-- Objetivo del modulo: este modulo responde las siguientes pregutnas :

-- 1. ¿Qué viajes existen?
-- 2. ¿Quién solicitó cada viaje?
-- 3. ¿Quién lo realizó?
-- 4. ¿Qué vehículo utilizó?
-- 5. ¿Cuál fue el estado?
-- 6. ¿Cuánto costó?
-- 7. ¿Cuántos viajes existen?
-- 8. ¿Qué viajes siguen activos?
-- 9. ¿Cómo ha cambiado el estado de un viaje?

--CONSULTA 1
-- Objetivo: listas todos los traslados registrados

SELECT * FROM traslado; 
SELECT id_traslado, id_cliente, id_chofer, id_vehiculo, estado_actual, costo_estimado, fecha_solicitud FROM traslado;

--CONSULTA 2
-- Mostrar los traslados mas recientes 

SELECT id_traslado, id_cliente, id_chofer, id_vehiculo, estado_actual, costo_estimado, fecha_solicitud FROM traslado ORDER BY fecha_solicitud DESC;


--CONSULTA 3
-- TRASLADOS PENDIENTE DE ASIGNACION EN ESTE CASO ESTADO = 'SOLICITADO'

SELECT id_traslado, id_cliente, id_chofer, id_vehiculo, estado_actual, costo_estimado, fecha_solicitud FROM traslado WHERE estado_actual = 'SOLICITADO'; 

--Consulta 4
-- TRASLADOS EN CURSO EN ESTE CASO ESTADO = 'EN_CURSO'

SELECT id_traslado, id_cliente, id_chofer, id_vehiculo, estado_actual, costo_estimado, fecha_solicitud FROM traslado WHERE estado_actual = 'EN_CURSO'; 

--Consulta 5
-- TRASLADOS FINALIZADOS EN ESTE CASO ESTADO = 'FINALIZADO'

SELECT id_traslado, id_cliente, id_chofer, id_vehiculo, estado_actual, costo_estimado, fecha_solicitud FROM traslado WHERE estado_actual = 'FINALIZADO'; 

-------------------------------
--Bloque de consultas con JOIN. 
-------------------------------

--Consulta 6. 

SELECT 

    t.id_traslado, 

    uc.nombre || ' ' || uc.apellido AS cliente, -- || LO USAMOS PARA CONCATENAR, esn este caso concatenamos el nombre y el apellido en el  alias cliente. 

    uch.nombre || ' ' || uch.apellido AS chofer, -- de la misma manera lo hacemos, el alias ahora  es chofer. 

    v.placa, -- placa del vehiculo 

    m.nombre AS marca, -- nombre de la marca 

    --Estados del traslado, costo estimado y fecha de solicitud.
    t.estado_actual, 
    t.costo_estimado, 
    t.fecha_solicitud
    from traslado t -- tabla de donde se extraen estos datos. 

    --JOIN para unir las tablas relacionadas con la tabla traslado, en este caso usuario y vehiculo.

    INNER JOIN usuario uc ON t.id_cliente = uc.id_usuario --uc: usuario cliente 

    INNER JOIN usuario uch  ON t.id_chofer = uch.id_usuario -- uch:usuario chofer

    INNER JOIN vehiculo v ON t.id_vehiculo = v.id_vehiculo -- v: vehiculo

    INNER JOIN marca m ON v.id_marca = m.id_marca; -- m: marca del vehiculo

--consulta 7
-- Objetivo: -- esta consulta nos permite ver el historial de cambios de estado de los traslados.

SELECT id_traslado, estado_anterior, estado_nuevo, observacion, fecha_cambio FROM historial_estado_traslado ORDER BY fecha_cambio; 

--Consulta 8.
-- Objetivo: ver el historial de cambios de estado de un traslado en particular, en este caso el traslado con id_traslado = 1.

SELECT estado_anterior, estado_nuevo, observacion, fecha_cambio FROM historial_estado_traslado WHERE id_traslado = 1 ORDER BY fecha_cambio;

-------------------------
--Consultas: Estadisticas
-------------------------
-- Consulta 9
-- Objetivo: obtener el total de traslados realizados.

Select COUNT (*) AS total_traslados FROM traslado; 

--consulta 10
-- Objetivo: obtener el total de traslados por estado.

SELECT estado_actual, COUNT (*) AS cantidad FROM traslado GROUP BY estado_actual;

--Consulta 11
--

SELECT AVG(costo_estimado) AS costo_promedio FROM traslado; --AVG: funcion que nos permite obtener el promedio de una columna, en este caso la columna costo_estimado.

