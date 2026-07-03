--Objetivo del módulo

--Responder preguntas como:
--¿Qué choferes están pendientes de aprobación?
--¿Qué vehículos tienen revisiones vencidas?
--¿Qué evaluaciones psicológicas están por vencer?
--¿Qué contactos de emergencia tiene cada chofer?
--¿Qué usuarios han sido penalizados?
--¿Qué administradores realizaron cambios?
--¿Qué parámetros tiene configurado el sistema?

-- CONSULTA 1
-- Configuración general del sistema

SELECT nombre, valor, descripcion, fecha_actualizacion FROM configuracion_sistema ORDER BY nombre;

--CONSULTA 2
-- Consultar la comidiion de la plataforma

SELECT  nombre, valor, descripcion FROM configuracion_sistema WHERE nombre = 'comision_plataforma';

-- CONSULTA 3
-- Choferes pendientes de aprobación

SELECT u.nombre, u.apellido, c.licencia, c.estado_aprobacion FROM chofer c INNER JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.estado_aprobacion = 'pendiente';

-- CONSULTA 4
-- Choferes aprobados
SELECT u.nombre, u.apellido, c.licencia, c.puntaje_promedio, c.viajes_completados FROM chofer c INNER JOIN usuario u ON c.id_usuario=u.id_usuario WHERE c.estado_aprobacion='aprobado';

--Consulta 5
-- Todos los vehículos
SELECT v.placa, m.nombre AS marca, v.modelo, v.color, v.estado FROM vehiculo v INNER JOIN marca m ON v.id_marca = m.id_marca;

--Consulta 6
-- vehiculos en mantenimiento

SELECT placa, modelo, estado FROM vehiculo WHERE estado =  'mantenimiento';



--Consulta 7
-- historial de revisiones de un vehiculo especifico

SELECT id_revision, id_vehiculo, fecha_revision, resultado, fecha_vencimiento, calificacion FROM revision_vehicular ORDER BY fecha_revision DESC;

--Consulta 8
-- Revisiones vencidas

SELECT id_revision, id_vehiculo, fecha_vencimiento FROM revision_vehicular WHERE fecha_vencimiento < CURRENT_TIMESTAMP;

-- Consulta 9. 
-- Todas las evaluaciones 

SELECT id_evaluacion, id_chofer, resultado, calificacion, fecha_vencimiento FROM evaluacion_psicologica; 

--Consulta 10 
--Evaluaciones vencidas 

SELECT id_evaluacion, id_chofer, fecha_vencimiento FROM evaluacion_psicologica WHERE fecha_vencimiento < CURRENT_TIMESTAMP;

--Consulta 11
-- Contactos de emergencia de los choferes

SELECT u.nombre, u.apellido, ce.nombre_contacto, ce.parentesco, ce.telefono_contacto FROM contacto_emergencia ce INNER JOIN usuario u ON ce.id_chofer = u.id_usuario; 

--Consulta 12 
--Penalizaciones 

SELECT u.nombre, u.apellido, p.tipo_penalizacion, p.monto, p.motivo, p.fecha_penalizacion FROM penalizacion p INNER JOIN usuario u ON p.id_usuario_afectado=u.id_usuario;

--Consulta 14 
-- Penalizaciones Economicas 

SELECT motivo, monto, fecha_penalizacion FROM penalizacion WHERE tipo_penalizacion = 'ECONOMICA'; 

--AUDITORIA 

SELECT u.nombre, u.apellido, a.entidad_afectada, a.accion, a.fecha_accion FROM auditoria_administrativa a INNER JOIN usuario u ON a.id_usuario_admin=u.id_usuario ORDER BY a.fecha_accion DESC;

SELECT u.nombre, u.apellido,

COUNT(*) AS acciones_realizadas

FROM auditoria_administrativa a

INNER JOIN usuario u ON a.id_usuario_admin= u.id_usuario GROUP BY u.nombre, u.apellido;