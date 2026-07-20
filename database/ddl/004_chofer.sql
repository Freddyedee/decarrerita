-- =====================================================
-- TABLA: CHOFER
-- Especialización de Usuario
-- =====================================================
CREATE TABLE chofer (
    
    id_usuario INTEGER PRIMARY KEY 
    REFERENCES usuario(id_usuario) 
    ON DELETE CASCADE,

    licencia VARCHAR(30) NOT NULL UNIQUE,
    estado_aprobacion VARCHAR(20) NOT NULL CHECK (estado_aprobacion IN ('pendiente', 'aprobado', 'rechazado', 'suspendido')),
    puntaje_promedio DECIMAL(3,2) DEFAULT 5.00 CHECK (puntaje_promedio BETWEEN 0 AND 5),
    viajes_completados INTEGER DEFAULT 0
);

SELECT * FROM chofer;