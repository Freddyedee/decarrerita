BEGIN; 

INSERT INTO traslado(
    id_cliente, id_chofer, id_vehiculo, id_tarifa, 
    origen_latitud, origen_longitud, destino_latitud, destino_longitud, 
    distancia_estimada_km, costo_estimado, estado_actual
)
VALUES (

    (SELECT id_usuario  FROM usuario  WHERE email = 'freddy@gmail.com'), 
    (SELECT id_usuario  FROM usuario  WHERE email = 'pedro@chofer.com'), 
    (SELECT id_vehiculo FROM vehiculo WHERE placa = 'ABC-123'),
    (SELECT id_tarifa   FROM tarifa LIMIT 1), 
    10.4806, -66.9036, --coordenadas de origen 
    10.4900, -66.9100, --coordenadas de destino
    5.5, 15.00, 'SOLICITADO'
);

-- 2. Registramos el historial de estado inicial
INSERT INTO historial_estado_traslado (id_traslado, estado_anterior, estado_nuevo, observacion)
VALUES (
    (SELECT id_traslado FROM traslado LIMIT 1), 
    'N/A', 'SOLICITADO', 'El cliente ha solicitado el servicio.'
);

COMMIT;

SELECT t.id_traslado, u1.nombre as cliente, u2.nombre as chofer, t.estado_actual
FROM traslado t
JOIN usuario u1 ON t.id_cliente = u1.id_usuario
JOIN usuario u2 ON t.id_chofer = u2.id_usuario;