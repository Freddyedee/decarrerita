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
        CHECK (estado_actual IN ('SOLICITADO', 'ASIGNADO', 'EN_CAMINO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO', 'BUSCANDO_CHOFER', 'SIN_CHOFER')),
    
	fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT fk_traslado_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario),
    CONSTRAINT fk_traslado_chofer FOREIGN KEY (id_chofer) REFERENCES chofer(id_usuario),
    CONSTRAINT fk_traslado_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo),
    CONSTRAINT fk_traslado_tarifa FOREIGN KEY (id_tarifa) REFERENCES tarifa(id_tarifa)


);



ALTER TABLE traslado DROP CONSTRAINT IF EXISTS traslado_estado_actual_check;

ALTER TABLE traslado ADD CONSTRAINT traslado_estado_actual_check 
  CHECK (estado_actual IN (
    'SOLICITADO', 
    'BUSCANDO_CHOFER', 
    'EN_CURSO', 
    'SIN_CHOFER', 
    'FINALIZADO', 
    'CANCELADO', 
    'EN_CAMINO'
  ));


  select * FROM traslado; 

  -- ====================================================================
-- SCRIPT DE REINICIO OPERATIVO SEGÚN ESQUEMA OFICIAL (DECARRERITA)
-- Preserva intactos: rol, banco, marca, modelo, tarifa, configuracion_sistema
-- ====================================================================

TRUNCATE TABLE 
  "public"."auditoria_administrativa",
  "public"."historial_estado_traslado",
  "public"."asignacion_chofer",
  "public"."calificacion",
  "public"."penalizacion",
  "public"."notificacion",
  "public"."movimiento_wallet",
  "public"."solicitud_retiro",
  "public"."recarga",
  "public"."traslado",
  "public"."evaluacion_psicologica",
  "public"."revision_vehicular",
  "public"."contacto_emergencia",
  "public"."vehiculo",
  "public"."chofer",
  "public"."cliente",
  "public"."wallet",
  "public"."usuario"
RESTART IDENTITY CASCADE;

-- ====================================================================
-- SEED INICIAL: ADMINISTRADOR Y EMPRESA (DECARRERITA)
-- ====================================================================

-- 1. Habilitamos extensión criptográfica nativa de PostgreSQL para Bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREAR USUARIO ADMINISTRADOR (ID = 1)
-- Contraseña de acceso para login: admin123
INSERT INTO "public"."usuario" (
  "id_usuario",
  "id_rol",
  "nombre",
  "apellido",
  "email",
  "telefono",
  "password_hash",
  "estado",
  "fecha_creacion"
) VALUES (
  1,
  (SELECT "id_rol" FROM "public"."rol" WHERE "nombre" ILIKE '%ADMIN%' ORDER BY "id_rol" ASC LIMIT 1),
  'Administrador',
  'General',
  'admin@decarrerita.com',
  '04140000000',
  crypt('admin123', gen_salt('bf', 10)), -- Genera hash Bcrypt real para 'admin123'
  'activo',
  NOW()
) ON CONFLICT ("id_usuario") DO UPDATE SET
  "email" = EXCLUDED."email",
  "password_hash" = EXCLUDED."password_hash";

-- Wallet del Administrador
INSERT INTO "public"."wallet" (
  "id_usuario",
  "saldo_disponible",
  "saldo_congelado",
  "estado_bloqueo",
  "moneda",
  "fecha_creacion"
) VALUES (
  1, 0.00, 0.00, false, 'USD', NOW()
) ON CONFLICT ("id_usuario") DO NOTHING;

-- ====================================================================
-- 3. CREAR USUARIO TESORERÍA / EMPRESA (ID = 19)
-- ====================================================================
INSERT INTO "public"."usuario" (
  "id_usuario",
  "id_rol",
  "nombre",
  "apellido",
  "email",
  "telefono",
  "password_hash",
  "estado",
  "fecha_creacion"
) VALUES (
  19,
  (SELECT "id_rol" FROM "public"."rol" WHERE "nombre" ILIKE '%ADMIN%' ORDER BY "id_rol" ASC LIMIT 1),
  'Tesoreria',
  'Decarrerita',
  'negocio@decarrerita.com',
  '000000000000',
  'CONTRASEÑA_NO_DISPONIBLE_ACCES_DENIED',
  'activo',
  NOW()
) ON CONFLICT ("id_usuario") DO UPDATE SET
  "nombre" = EXCLUDED."nombre",
  "apellido" = EXCLUDED."apellido",
  "email" = EXCLUDED."email",
  "password_hash" = EXCLUDED."password_hash";

-- Wallet de la Empresa (ID Usuario = 19)
INSERT INTO "public"."wallet" (
  "id_usuario",
  "saldo_disponible",
  "saldo_congelado",
  "estado_bloqueo",
  "moneda",
  "fecha_creacion"
) VALUES (
  19, 0.00, 0.00, false, 'USD', NOW()
) ON CONFLICT ("id_usuario") DO NOTHING;

-- ====================================================================
-- 4. BLINDAJE DE SECUENCIA EN POSTGRESQL
-- Adelantamos el contador automático a 20 para evitar colisiones futuras
-- ====================================================================
SELECT setval(
  pg_get_serial_sequence('"public"."usuario"', 'id_usuario'),
  20,
  false
);