CREATE TABLE contacto_emergencia (

    id_contacto SERIAL PRIMARY KEY, 
    id_chofer INTEGER NOT NULL, 

    nombre_contacto VARCHAR (100) NOT NULL, 
    parentesco VARCHAR (50) NOT NULL, 
    telefono_contacto VARCHAR (20) NOT NULL, 
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_contacto_chofer 
	FOREIGN KEY (id_chofer) 
	REFERENCES chofer(id_usuario) 
	ON DELETE CASCADE
);