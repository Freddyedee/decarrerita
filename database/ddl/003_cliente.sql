CREATE TABLE cliente (
    id_usuario INTEGER PRIMARY KEY 
	REFERENCES usuario(id_usuario) ON DELETE CASCADE,
	
    rating_promedio DECIMAL(3,2) DEFAULT 5.00 
	CHECK (rating_promedio BETWEEN 0 AND 5)
);

SELECT * FROM cliente;