CREATE TABLE vehiculo (
    id_vehiculo SERIAL PRIMARY KEY,
    id_marca INTEGER NOT NULL,
    id_chofer INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(50) NOT NULL,
    color VARCHAR(30) NOT NULL,
    annio SMALLINT NOT NULL,
    capacidad_pasajeros SMALLINT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'en_revision', 'mantenimiento')),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    
    CONSTRAINT fk_vehiculo_marca FOREIGN KEY (id_marca) REFERENCES marca(id_marca),
    CONSTRAINT fk_vehiculo_chofer FOREIGN KEY (id_chofer) REFERENCES chofer(id_usuario) ON DELETE CASCADE
);
