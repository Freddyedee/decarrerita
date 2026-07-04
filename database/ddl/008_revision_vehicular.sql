CREATE TABLE revision_vehicular (
    id_revision SERIAL PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL, 

    fecha_revision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resultado VARCHAR (20) NOT NULL, 
    observaciones VARCHAR (255) NOT NULL, 
    fecha_vencimiento TIMESTAMP NOT NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 0 AND 100), 

    CONSTRAINT fk_revision_vehiculo 
	FOREIGN KEY (id_vehiculo) 
	REFERENCES vehiculo(id_vehiculo) 
	ON DELETE CASCADE
);