CREATE TABLE evaluacion_psicologica (

	id_evaluacion SERIAL PRIMARY KEY, 
	id_chofer INTEGER NOT NULL,

	fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	resultado VARCHAR (50) NOT NULL, 
	observaciones VARCHAR (255) NOT NULL, 
	fecha_vencimiento TIMESTAMP NOT NULL,
	calificacion INTEGER NOT NULL 
		CHECK (calificacion BETWEEN 0 AND 100), 

	CONSTRAINT fk_evaluacion_psicologica_chofer
		FOREIGN KEY (id_chofer) REFERENCES chofer (id_usuario)
		ON DELETE CASCADE

);