CREATE TABLE rol (
    id_rol SMALLINT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(30)
);