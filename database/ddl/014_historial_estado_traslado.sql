CREATE TABLE historial_estado_traslado (
    id_historial_estado SERIAL PRIMARY KEY,
    id_traslado INTEGER NOT NULL, 

    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,
    observacion TEXT,
    fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_traslado 
    FOREIGN KEY (id_traslado) 
    REFERENCES traslado(id_traslado) 
    ON DELETE CASCADE
); 