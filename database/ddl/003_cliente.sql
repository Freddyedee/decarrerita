/*
=========================================================
TABLA: CLIENTE
Módulo: Usuarios
Descripción:
Especialización de un usuario con perfil de cliente.
=========================================================
*/

CREATE TABLE Cliente (

    id_usuario INTEGER PRIMARY KEY,

    rating_promedio DECIMAL(3,2)
        DEFAULT 5.00
        CHECK (rating_promedio BETWEEN 0 AND 5),

    CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE

);