-- 1. Catálogos básicos, rol, marca, banco, etc. 
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(30)
);