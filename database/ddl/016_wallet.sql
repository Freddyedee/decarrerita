CREATE TABLE wallet (
    id_wallet SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE, -- atributo derivado de la relación uno a uno con la tabla usuario
	
    saldo_disponible DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    saldo_congelado DECIMAL(12,2) NOT NULL DEFAULT 0.00, --logica interna 

	estado_bloqueo BOOLEAN NOT NULL DEFAULT FALSE, --logica interna
	moneda VARCHAR (3) NOT NULL DEFAULT 'USD', 
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT fk_wallet_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);