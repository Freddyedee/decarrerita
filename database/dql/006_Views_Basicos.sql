-- VIEW : consulta almacenada en la base de datos que se comporta como una tabla virtual.  

-- Este view tiene como proposito mostrar el traslado/viaje completo, es decir, une todo el flujo del viaje
-- Traslado, chofer, cliente, vehiculo, marca, tarifa. 

--VIEW 1: 

CREATE OR REPLACE VIEW vw_traslado_completos AS SELECT

t.id_traslado, --campo de id en traslado 
t.estado_actual, -- campo estado_actual en traslado 
t.fecha_solicitud, -- campo fecha_solicitud en traslado

c.id_usuario AS id_cliente, -- campo de id_cliente en usuario 
uc.nombre AS nombre_cliente, -- uc: Usuario Cliente, campo nombre en usuario
uc.apellido AS apellido_cliente, -- campo apellido en usuario

ch.id_usuario AS id_chofer, -- ch: chofer, campo id_usuario en usuario
uch.nombre AS nombre_chofer, -- uch: Usuario CHofer, campo nombre en el usuario 
uch.apellido AS apellido_chofer, -- campo apellido en usuario

v.id_vehiculo, --campos para el vehiculo, id_vehiculo
v.placa, -- placa
v.modelo, --modelo

m.nombre AS marca, -- nombre en marca

t.distancia_estimada_km, -- traslado t: distancia_estimada_km
t.costo_estimado -- costo_estimado del traslado 

FROM traslado t 

JOIN cliente c ON t.id_cliente = c.id_usuario -- se verifica el cliente 
JOIN usuario uc ON c.id_usuario = uc.id_usuario 

JOIN chofer ch ON t.id_chofer = ch.id_usuario -- se verifica el chofer 
JOIN usuario uch ON ch.id_usuario = uch.id_usuario 

JOIN vehiculo v ON t.id_vehiculo = v.id_vehiculo  -- se verifica el vehiculo 
JOIN marca m on v.id_marca = m.id_marca; -- se verifica marca 

SELECT * FROM vw_traslado_completos; -- consulta de prueba

--VIEW 2: 

--Proposito: Estado financiero de cada usuario. 

CREATE OR REPLACE VIEW vw_estado_wallet_usuario AS 
SELECT u.id_usuario, u.nombre, u.apellido, w.saldo_disponible, w.saldo_congelado, w.moneda, w.estado_bloqueo FROM usuario u JOIN wallet w ON u.id_usuario = w.id_usuario;

SELECT * FROM vw_estado_wallet_usuario; 


-- VIEW 3: 

--Proposito: Perfil completo del chofer 

CREATE OR REPLACE VIEW vw_choferes_perfil_completo AS 
SELECT u.id_usuario, u.nombre, u.apellido, u.email, ch.licencia, ch.estado_aprobacion, ch.puntaje_promedio, ch.viajes_completados FROM chofer ch JOIN usuario u ON ch.id_usuario = u.id_usuario;

SELECT * FROM vw_choferes_perfil_completo


