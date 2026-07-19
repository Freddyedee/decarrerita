-- CreateTable
CREATE TABLE "asignacion_chofer" (
    "id_asignacion" SERIAL NOT NULL,
    "id_traslado" INTEGER NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "prioridad" INTEGER NOT NULL,
    "estado_respuesta" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "asignacion_chofer_pkey" PRIMARY KEY ("id_asignacion")
);

-- CreateTable
CREATE TABLE "auditoria_administrativa" (
    "id_auditoria" SERIAL NOT NULL,
    "id_usuario_admin" INTEGER NOT NULL,
    "entidad_afectada" VARCHAR(50) NOT NULL,
    "id_registro_afecta" INTEGER NOT NULL,
    "accion" VARCHAR(30) NOT NULL,
    "valor_anterior" TEXT NOT NULL,
    "valor_nuevo" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "fecha_accion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_administrativa_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "banco" (
    "id_banco" SERIAL NOT NULL,
    "nombre_banco" VARCHAR(100) NOT NULL,
    "codigo_banco" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "banco_pkey" PRIMARY KEY ("id_banco")
);

-- CreateTable
CREATE TABLE "calificacion" (
    "id_calificacion" SERIAL NOT NULL,
    "id_traslado" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "calificador_es_cliente" BOOLEAN NOT NULL,
    "puntuacion" SMALLINT NOT NULL,
    "comentario" TEXT,
    "fecha_calificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificacion_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateTable
CREATE TABLE "chofer" (
    "id_usuario" INTEGER NOT NULL,
    "licencia" VARCHAR(30) NOT NULL,
    "estado_aprobacion" VARCHAR(20) NOT NULL,
    "puntaje_promedio" DECIMAL(3,2) DEFAULT 5.00,
    "viajes_completados" INTEGER DEFAULT 0,
    "id_banco" INTEGER,
    "numero_cuenta" VARCHAR(20),

    CONSTRAINT "chofer_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_usuario" INTEGER NOT NULL,
    "rating_promedio" DECIMAL(3,2) DEFAULT 5.00,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "configuracion_sistema" (
    "id_configuracion" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "valor" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_actualizacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateTable
CREATE TABLE "contacto_emergencia" (
    "id_contacto" SERIAL NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "nombre_contacto" VARCHAR(100) NOT NULL,
    "parentesco" VARCHAR(50) NOT NULL,
    "telefono_contacto" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "contacto_emergencia_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "evaluacion_psicologica" (
    "id_evaluacion" SERIAL NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "fecha_evaluacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultado" VARCHAR(50) NOT NULL,
    "observaciones" VARCHAR(255) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(6) NOT NULL,
    "calificacion" INTEGER NOT NULL,

    CONSTRAINT "evaluacion_psicologica_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateTable
CREATE TABLE "historial_estado_traslado" (
    "id_historial_estado" SERIAL NOT NULL,
    "id_traslado" INTEGER NOT NULL,
    "estado_anterior" VARCHAR(30) NOT NULL,
    "estado_nuevo" VARCHAR(30) NOT NULL,
    "observacion" TEXT,
    "fecha_cambio" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estado_traslado_pkey" PRIMARY KEY ("id_historial_estado")
);

-- CreateTable
CREATE TABLE "movimiento_wallet" (
    "id_movimiento" SERIAL NOT NULL,
    "id_wallet" INTEGER NOT NULL,
    "id_traslado" INTEGER,
    "tipo_movimiento" VARCHAR(30) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "saldo_anterior" DECIMAL(12,2) NOT NULL,
    "saldo_posterior" DECIMAL(12,2) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_movimiento" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_wallet_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "mensaje" VARCHAR(255) NOT NULL,
    "tipo_notificacion" VARCHAR(100) NOT NULL,
    "fecha_envio" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(6),

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "penalizacion" (
    "id_penalizacion" SERIAL NOT NULL,
    "id_wallet" INTEGER NOT NULL,
    "id_traslado" INTEGER NOT NULL,
    "id_usuario_afectado" INTEGER NOT NULL,
    "motivo" VARCHAR(100) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "fecha_penalizacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_penalizacion" VARCHAR(20) NOT NULL,
    "observacion" TEXT NOT NULL,

    CONSTRAINT "penalizacion_pkey" PRIMARY KEY ("id_penalizacion")
);

-- CreateTable
CREATE TABLE "recarga" (
    "id_recarga" SERIAL NOT NULL,
    "id_wallet" INTEGER NOT NULL,
    "id_banco" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "referencia_pago" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "fecha_solicitud" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_aprobacion" TIMESTAMP(6),

    CONSTRAINT "recarga_pkey" PRIMARY KEY ("id_recarga")
);

-- CreateTable
CREATE TABLE "revision_vehicular" (
    "id_revision" SERIAL NOT NULL,
    "id_vehiculo" INTEGER NOT NULL,
    "fecha_revision" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultado" VARCHAR(20) NOT NULL,
    "observaciones" VARCHAR(255) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(6) NOT NULL,
    "calificacion" INTEGER NOT NULL,

    CONSTRAINT "revision_vehicular_pkey" PRIMARY KEY ("id_revision")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "solicitud_retiro" (
    "id_retiro" SERIAL NOT NULL,
    "id_wallet" INTEGER NOT NULL,
    "id_banco" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "numero_cuenta" VARCHAR(50) NOT NULL,
    "titular_cuenta" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "fecha_solicitud" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_procesamiento" TIMESTAMP(6),

    CONSTRAINT "solicitud_retiro_pkey" PRIMARY KEY ("id_retiro")
);

-- CreateTable
CREATE TABLE "tarifa" (
    "id_tarifa" SERIAL NOT NULL,
    "precio_km" DECIMAL(12,2) NOT NULL,
    "tarifa_base" DECIMAL(12,2) NOT NULL,
    "tarifa_cancelacion" DECIMAL(12,2) NOT NULL,
    "porcentaje_comision" DECIMAL(5,2) NOT NULL,
    "fecha_inicio_vigencia" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin_vigencia" TIMESTAMP(6),

    CONSTRAINT "tarifa_pkey" PRIMARY KEY ("id_tarifa")
);

-- CreateTable
CREATE TABLE "traslado" (
    "id_traslado" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "id_vehiculo" INTEGER NOT NULL,
    "id_tarifa" INTEGER NOT NULL,
    "origen_latitud" DECIMAL(9,6) NOT NULL,
    "origen_longitud" DECIMAL(9,6) NOT NULL,
    "destino_latitud" DECIMAL(9,6) NOT NULL,
    "destino_longitud" DECIMAL(9,6) NOT NULL,
    "distancia_estimada_km" DECIMAL(10,2) NOT NULL,
    "costo_estimado" DECIMAL(12,2) NOT NULL,
    "estado_actual" VARCHAR(30) NOT NULL DEFAULT 'SOLICITADO',
    "fecha_solicitud" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traslado_pkey" PRIMARY KEY ("id_traslado")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "vehiculo" (
    "id_vehiculo" SERIAL NOT NULL,
    "id_marca" INTEGER NOT NULL,
    "id_chofer" INTEGER NOT NULL,
    "placa" VARCHAR(10) NOT NULL,
    "modelo" VARCHAR(50) NOT NULL,
    "color" VARCHAR(30) NOT NULL,
    "annio" SMALLINT NOT NULL,
    "capacidad_pasajeros" SMALLINT NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "fecha_registro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("id_vehiculo")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id_wallet" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "saldo_disponible" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "saldo_congelado" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "estado_bloqueo" BOOLEAN NOT NULL DEFAULT false,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id_wallet")
);

-- CreateTable
CREATE TABLE "marca" (
    "id_marca" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(100),

    CONSTRAINT "marca_pkey" PRIMARY KEY ("id_marca")
);

-- CreateIndex
CREATE UNIQUE INDEX "banco_nombre_banco_key" ON "banco"("nombre_banco");

-- CreateIndex
CREATE UNIQUE INDEX "banco_codigo_banco_key" ON "banco"("codigo_banco");

-- CreateIndex
CREATE UNIQUE INDEX "chofer_licencia_key" ON "chofer"("licencia");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_sistema_nombre_key" ON "configuracion_sistema"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefono_key" ON "usuario"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculo_placa_key" ON "vehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_id_usuario_key" ON "wallet"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "marca_nombre_key" ON "marca"("nombre");

-- AddForeignKey
ALTER TABLE "asignacion_chofer" ADD CONSTRAINT "fk_asignacion_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_chofer" ADD CONSTRAINT "fk_asignacion_traslado" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria_administrativa" ADD CONSTRAINT "fk_auditoria_admin" FOREIGN KEY ("id_usuario_admin") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "fk_cal_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "fk_cal_cliente" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "fk_cal_traslado" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chofer" ADD CONSTRAINT "fk_chofer_banco" FOREIGN KEY ("id_banco") REFERENCES "banco"("id_banco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chofer" ADD CONSTRAINT "chofer_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contacto_emergencia" ADD CONSTRAINT "fk_contacto_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluacion_psicologica" ADD CONSTRAINT "fk_evaluacion_psicologica_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_estado_traslado" ADD CONSTRAINT "fk_historial_traslado" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimiento_wallet" ADD CONSTRAINT "fk_mov_traslado" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimiento_wallet" ADD CONSTRAINT "fk_mov_wallet" FOREIGN KEY ("id_wallet") REFERENCES "wallet"("id_wallet") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "fk_notificacion_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "penalizacion" ADD CONSTRAINT "fk_pen_traslado" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "penalizacion" ADD CONSTRAINT "fk_pen_usuario" FOREIGN KEY ("id_usuario_afectado") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "penalizacion" ADD CONSTRAINT "fk_pen_wallet" FOREIGN KEY ("id_wallet") REFERENCES "wallet"("id_wallet") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recarga" ADD CONSTRAINT "fk_recarga_banco" FOREIGN KEY ("id_banco") REFERENCES "banco"("id_banco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recarga" ADD CONSTRAINT "fk_recarga_wallet" FOREIGN KEY ("id_wallet") REFERENCES "wallet"("id_wallet") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "revision_vehicular" ADD CONSTRAINT "fk_revision_vehiculo" FOREIGN KEY ("id_vehiculo") REFERENCES "vehiculo"("id_vehiculo") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitud_retiro" ADD CONSTRAINT "fk_retiro_banco" FOREIGN KEY ("id_banco") REFERENCES "banco"("id_banco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitud_retiro" ADD CONSTRAINT "fk_retiro_wallet" FOREIGN KEY ("id_wallet") REFERENCES "wallet"("id_wallet") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "fk_traslado_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "fk_traslado_cliente" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "fk_traslado_tarifa" FOREIGN KEY ("id_tarifa") REFERENCES "tarifa"("id_tarifa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "fk_traslado_vehiculo" FOREIGN KEY ("id_vehiculo") REFERENCES "vehiculo"("id_vehiculo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehiculo" ADD CONSTRAINT "fk_vehiculo_chofer" FOREIGN KEY ("id_chofer") REFERENCES "chofer"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehiculo" ADD CONSTRAINT "fk_vehiculo_marca" FOREIGN KEY ("id_marca") REFERENCES "marca"("id_marca") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "fk_wallet_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;
