BEGIN; 

UPDATE traslado SET estado_actual = 'ASIGNADO' WHERE id_traslado = 1; 

INSERT INTO historial_estado_traslado (id_traslado, estado_anterior, estado_nuevo, observacion)
VALUES (1, 'SOLICITADO', 'ASIGNADO', 'El chofer acepto la solicitud'); 

UPDATE traslado SET estado_actual = 'EN_CURSO' WHERE id_traslado = 1;

INSERT INTO historial_estado_traslado (id_traslado, estado_anterior, estado_nuevo, observacion)
VALUES (1, 'ASIGNADO', 'EN_CURSO', 'El cliente ha abordado el vehiculo. ');

-- 3. CAMBIO: De EN_CURSO a FINALIZADO
UPDATE traslado SET estado_actual = 'FINALIZADO' WHERE id_traslado = 1;

INSERT INTO historial_estado_traslado (id_traslado, estado_anterior, estado_nuevo, observacion)
VALUES (1, 'EN_CURSO', 'FINALIZADO', 'Viaje completado exitosamente.');

COMMIT;


-- Consulta de verificación para ver el rastro del viaje
