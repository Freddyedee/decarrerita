CREATE TABLE movimiento_wallet (
    id_movimiento SERIAL PRIMARY KEY,
    id_wallet INTEGER NOT NULL,
    id_traslado INTEGER, 
    
    tipo_movimiento VARCHAR(30) NOT NULL 
    CHECK (tipo_movimiento IN ('PAGO_TRASLADO', 'RECARGA', 'COMISION_EMPRESA', 'RETIRO', 'PENALIZACION', 'AJUSTE', 'REVERSO')),
    
    monto DECIMAL(12,2) NOT NULL,
    saldo_anterior DECIMAL(12,2) NOT NULL,
    saldo_posterior DECIMAL(12,2) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_movimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mov_wallet 
    FOREIGN KEY (id_wallet) 
    REFERENCES wallet(id_wallet) 
    ON DELETE CASCADE,

    CONSTRAINT fk_mov_traslado 
    FOREIGN KEY (id_traslado) 
    REFERENCES traslado(id_traslado)
); 