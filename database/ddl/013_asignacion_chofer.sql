CREATE TABLE asignacion_chofer (
    id_asignacion SERIAL PRIMARY KEY,
    id_traslado INTEGER NOT NULL,
    id_chofer INTEGER NOT NULL,
    prioridad INT NOT NULL CHECK (prioridad BETWEEN 1 AND 5),
    estado_respuesta VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' 
        CHECK (estado_respuesta IN ('PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EXPIRADO')),
    
	CONSTRAINT fk_asignacion_traslado FOREIGN KEY (id_traslado) REFERENCES traslado(id_traslado) ON DELETE CASCADE,
    CONSTRAINT fk_asignacion_chofer FOREIGN KEY (id_chofer) REFERENCES chofer(id_usuario) ON DELETE CASCADE
);
