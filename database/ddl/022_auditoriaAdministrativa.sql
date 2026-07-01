CREATE TABLE auditoria_administrativa (

    id_auditoria SERIAL PRIMARY KEY,
    id_usuario_admin INTEGER NOT NULL, -- Cambiado a INTEGER
    
    entidad_afectada VARCHAR(50) NOT NULL,
    id_registro_afecta INTEGER NOT NULL, -- Cambiado a INTEGER para coherencia
    accion VARCHAR(30) NOT NULL,
    valor_anterior TEXT NOT NULL,
    valor_nuevo TEXT NOT NULL,
    observacion TEXT NOT NULL,
    fecha_accion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_auditoria_admin 
    FOREIGN KEY (id_usuario_admin)
     REFERENCES usuario(id_usuario)
); 