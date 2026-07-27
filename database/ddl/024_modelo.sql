CREATE TABLE IF NOT EXISTS modelo (
    id_modelo SERIAL PRIMARY KEY,
    id_marca INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT fk_modelo_marca FOREIGN KEY (id_marca) REFERENCES marca(id_marca) ON DELETE CASCADE
);

SELECT * FROM modelo;