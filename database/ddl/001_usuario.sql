create table usuario (

	id_usuario	SERIAL PRIMARY KEY,
	id_rol 		INT NOT NULL,

	nombre		VARCHAR (50) NOT NULL,
	apellido 	VARCHAR (50) NOT NULL,

	email		VARCHAR (100) NOT NULL UNIQUE,
	telefono 	VARCHAR (20) UNIQUE, 

	password_hash	VARCHAR (255) NOT NULL, 

	estado		VARCHAR (20) NOT NULL
				CHECK (estado IN ('activo', 'inactivo', 'suspendido')),

	fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
);