CREATE TABLE calificacion (
    id_calificacion SERIAL PRIMARY KEY,
    id_traslado INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    id_chofer INTEGER NOT NULL,
	
    calificador_es_cliente BOOLEAN NOT NULL,
    puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cal_traslado 
    FOREIGN KEY (id_traslado) 
    REFERENCES traslado(id_traslado) 
    ON DELETE CASCADE,

    CONSTRAINT fk_cal_cliente 
    FOREIGN KEY (id_cliente) 
    REFERENCES cliente(id_usuario),

    CONSTRAINT fk_cal_chofer 
    FOREIGN KEY (id_chofer) 
    REFERENCES chofer(id_usuario)
);