CREATE TABLE penalizacion (
    id_penalizacion SERIAL PRIMARY KEY,
    id_wallet INTEGER NOT NULL,
    id_traslado INTEGER NOT NULL,
	id_usuario_afectado INTEGER NOT NULL,
	
    motivo VARCHAR(100) NOT NULL,
    monto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    fecha_penalizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_penalizacion VARCHAR(20) NOT NULL CHECK (tipo_penalizacion IN ('ECONOMICA', 'REPUTACIONAL', 'MIXTA')),
    observacion TEXT NOT NULL,
	
    CONSTRAINT fk_pen_wallet 
    FOREIGN KEY (id_wallet) 
    REFERENCES wallet(id_wallet) 
    ON DELETE CASCADE,

    CONSTRAINT fk_pen_traslado 
    FOREIGN KEY (id_traslado) 
    REFERENCES traslado(id_traslado) 
    ON DELETE CASCADE,

    CONSTRAINT fk_pen_usuario 
    FOREIGN KEY (id_usuario_afectado) 
    REFERENCES usuario(id_usuario)
);
