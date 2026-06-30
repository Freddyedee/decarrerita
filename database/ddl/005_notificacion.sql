
CREATE TABLE notificacion (
    id_notificacion SERIAL PRIMARY KEY, 
    id_usuario INTEGER NOT NULL,

    titulo VARCHAR (50) NOT NULL, 
    mensaje VARCHAR (255) NOT NULL,

    tipo_notificacion VARCHAR(100) NOT NULL 
	CHECK (tipo_notificacion 
	IN ('informacion', 'alerta', 'pago', 'translado', 'sistema')), 

    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    fecha_lectura TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_notificacion_usuario 
	FOREIGN KEY (id_usuario) 
	REFERENCES usuario(id_usuario) 
	ON DELETE CASCADE
);