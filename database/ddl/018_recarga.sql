CREATE TABLE recarga (

    id_recarga SERIAL PRIMARY KEY,
    id_wallet INTEGER NOT NULL,
    id_banco INTEGER NOT NULL,

    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    referencia_pago VARCHAR(100) NOT NULL,

    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' 
    CHECK (estado IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')),

    fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP,

    CONSTRAINT fk_recarga_wallet 
    FOREIGN KEY (id_wallet) 
    REFERENCES wallet(id_wallet) 
    ON DELETE CASCADE,

    CONSTRAINT fk_recarga_banco 
    FOREIGN KEY (id_banco) 
    REFERENCES banco(id_banco)
); 

SELECt * FROM recarga;
