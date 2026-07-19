CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_usuario_rol 
    FOREIGN KEY (id_rol) 
    REFERENCES rol(id_rol)
);


SELECT *  FROM usuario;

UPDATE usuario SET password_hash = '$2b$10$t5xoS6LN8XUUsicRuYcu7.cETwdztCsL9tBNcBOoGvPolVZdlDTLW' WHERE id_usuario = 1;