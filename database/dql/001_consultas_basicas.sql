-- este archivo contendra consultas para los usuarios,
-- Usuarios generales, usuarios por estado, usuarios por rol, Clientes, Choferes, Estadisticas basicas. 

-- CONSULTA: Obtener todos los usuarios 
-- Objetivo: ver el listado compleot de usuarios registrados en la base de datos.

Select id_usuario, nombre, apellido, email, telefono, estado, fecha_creacion FROM usuario; 

--CONSULTA: Obtener los usuarios ordenados (ORDER BY (parametro de ordenamiento) ASC/DESC)
--OBJETIVO: Visualizar los usuarios mas recientes registrados en el sistema. 

SELECT id_usuario, nombre, apellido, email, telefono, estado, fecha_creacion FROM usuario ORDER BY fecha_creacion DESC; 

--CONSULTA: Usuarios activos. 
--OBJETIVO: Visualizar los usuarios que se encuentran activos en el sistema.

SELECT id_usuario, nombre, apellido, email, telefono, estado, fecha_creacion FROM usuario WHERE estado = 'activo';

--CONSULTA: Usuarios inactivos o suspendidos. 
--OBJETIVO: Visualizar los usuarios que se encuentran inactivos o suspendidos en el sistema.

SELECT id_usuario, nombre, apellido, email, telefono, estado, fecha_creacion FROM usuario WHERE estado IN ('inactivo', 'suspendido');

--CONSULTA: Usuarios por rol.
--OBJETIVO: Visualizar los usuarios que pertenecen a un rol especifico en el

SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.telefono, u.estado, u.fecha_creacion FROM usuario u INNER JOIN rol r ON u.id_rol = r.id_rol;

SELECT u.id_usuario,u.nombre, u.apellido, u.email, u.telefono, u.estado FROM usuario u INNER JOIN rol r ON u.id_rol = r.id_rol WHERE r.nombre = 'Chofer'


SELECT u.id_usuario,u.nombre, u.apellido, u.email, u.telefono, u.estado FROM usuario u INNER JOIN rol r ON r.id_rol = u.id_rol WHERE r.nombre = 'Cliente';   

SELECT u.id_usuario, u.nombre, u.apellido, u.estado, c.rating_promedio FROM usuario u INNER JOIN cliente c ON u.id_usuario = c.id_usuario;

SELECT u.id_usuario,u.nombre, u.apellido, u.email, u.telefono, u.estado, c.rating_promedio FROM usuario u INNER JOIN rol r ON r.id_rol = u.id_rol INNER JOIN cliente c ON u.id_usuario = c.id_usuario;   

-- CONSULTA: CHOFERES COMPLETOS
SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.telefono, u.estado, c.licencia, c.estado_aprobacion, c.puntaje_promedio, c.viajes_completados FROM usuario u INNER JOIN chofer c ON u.id_usuario = c.id_usuario;   

-- CONSULTA: TOTAL DE USUARIOS

SELECT COUNT (*) AS total_usuarios FROM usuario;

--Usuarios por rol 

SELECT r.nombre AS rol,
 COUNT (u.id_usuario) AS cantidad FROM usuario u 
 INNER JOIN rol r ON u.id_rol = r.id_rol GROUP BY r.nombre; 

