CREATE TABLE traslado (
    id_traslado SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_chofer INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    id_tarifa INTEGER NOT NULL,
	
    origen_latitud DECIMAL(9,6) NOT NULL,
    origen_longitud DECIMAL(9,6) NOT NULL,
    destino_latitud DECIMAL(9,6) NOT NULL,
    destino_longitud DECIMAL(9,6) NOT NULL,
    distancia_estimada_km DECIMAL(10,2) NOT NULL,
    costo_estimado DECIMAL(12,2) NOT NULL,
	
    estado_actual VARCHAR(30) NOT NULL DEFAULT 'SOLICITADO' 
        CHECK (estado_actual IN ('SOLICITADO', 'ASIGNADO', 'EN_CAMINO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO')),
    
	fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT fk_traslado_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario),
    CONSTRAINT fk_traslado_chofer FOREIGN KEY (id_chofer) REFERENCES chofer(id_usuario),
    CONSTRAINT fk_traslado_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo),
    CONSTRAINT fk_traslado_tarifa FOREIGN KEY (id_tarifa) REFERENCES tarifa(id_tarifa)
);