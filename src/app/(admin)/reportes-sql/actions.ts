// src/app/(admin)/reportes-sql/actions.ts
'use server'

import { prisma } from '@/shared/lib/prisma'





// --- CHOFER: Traslados en un periodo de tiempo
export async function fetchTrasladosChofer(params?: Record<string, string>) {
  try {
    // Si no envían parámetros, ponemos unos por defecto para que no falle
    const choferId = params?.id_chofer || '1';
    const fechaInicio = params?.fecha_inicio || '2026-01-01';
    const fechaFin = params?.fecha_fin || '2026-12-31';

    // Construimos el string SQL puro dinámicamente
    const sqlQuery = `SELECT 
  id_traslado, 
  distancia_estimada_km, 
  costo_estimado, 
  estado_actual, 
  fecha_solicitud
FROM traslado
WHERE id_chofer = ${choferId} 
AND fecha_solicitud >= '${fechaInicio} 00:00:00' 
AND fecha_solicitud <= '${fechaFin} 23:59:59'
ORDER BY fecha_solicitud DESC;`;

    // Lo ejecutamos tal cual usando Unsafe (ideal para este requerimiento específico)
    const data = await prisma.$queryRawUnsafe(sqlQuery);

    return { success: true, data, sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CHOFER: Perfil Completo y Contactos de Emergencia ---
export async function fetchPerfilChofer(params?: Record<string, string>) {
  try {
    const choferId = params?.id_chofer || '1';
    
    // Usamos LEFT JOIN para banco por si el chofer aún no ha registrado uno
    const sqlQuery = `SELECT 
    u.nombre, 
    u.apellido, 
    u.telefono,
    c.licencia, 
    c.estado_aprobacion, 
    b.nombre_banco, 
    c.numero_cuenta,
    ce.nombre_contacto AS contacto_emergencia, 
    ce.telefono_contacto AS tlf_emergencia
    FROM chofer c
    INNER JOIN usuario u ON c.id_usuario = u.id_usuario
    LEFT JOIN banco b ON c.id_banco = b.id_banco
    LEFT JOIN contacto_emergencia ce ON c.id_usuario = ce.id_chofer
    WHERE c.id_usuario = ${choferId};`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data, sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CHOFER: Cuentas por Cobrar (Viajes completados, 70% de ganancia) ---
export async function fetchPagadoAChofer(params?: Record<string, string>) {
  try {
    const choferId = params?.id_chofer || '14'; // Usando el ID de tus logs
    const fechaInicio = params?.fecha_inicio || '2026-07-01';
    const fechaFin = params?.fecha_fin || '2026-07-28';
    
    // Consultamos la tabla solicitud_retiro enlazada con banco y wallet 
    // tal como lo hace tu ruta /api/reportes/pagado-chofer/[id]
    const sqlQuery = `SELECT 
    sr.id_retiro, 
    sr.monto, 
    sr.numero_cuenta, 
    sr.titular_cuenta, 
    sr.estado, 
    sr.fecha_procesamiento, 
    b.nombre_banco
    FROM solicitud_retiro sr
    INNER JOIN wallet w ON sr.id_wallet = w.id_wallet
    INNER JOIN banco b ON sr.id_banco = b.id_banco
    WHERE w.id_usuario = ${choferId} 
    AND sr.estado = 'APROBADO'
    AND sr.fecha_solicitud >= '${fechaInicio} 00:00:00' 
    AND sr.fecha_solicitud <= '${fechaFin} 23:59:59'
    ORDER BY sr.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CHOFER: Traslados Cancelados por la Empresa ---
export async function fetchTrasladosCanceladosChofer(params?: Record<string, string>) {
  try {
    const choferId = params?.id_chofer || '3'; // Asegúrate de usar el ID de prueba correcto
    
    const sqlQuery = `SELECT 
      t.id_traslado, 
      t.fecha_solicitud, 
      t.origen_latitud, 
      t.destino_latitud, 
      t.costo_estimado, 
      t.estado_actual
    FROM traslado t
    WHERE t.id_chofer = ${choferId} 
    AND t.estado_actual LIKE '%CANCELADO%'
    ORDER BY t.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}


// --- USUARIOS GENERALES: Listado Maestro ---
export async function fetchTodosLosUsuarios() {
  try {
    const sqlQuery = `SELECT 
  u.id_usuario, 
  u.nombre, 
  u.apellido, 
  u.email, 
  u.estado, 
  r.nombre AS rol, 
  u.fecha_creacion
FROM usuario u
INNER JOIN rol r ON u.id_rol = r.id_rol
ORDER BY u.id_usuario ASC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data, sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- USUARIOS GENERALES: Estado de Wallets ---
export async function fetchSaldosWallets() {
  try {
    const sqlQuery = `SELECT 
  w.id_wallet, 
  u.nombre, 
  u.apellido, 
  r.nombre AS rol, 
  w.saldo_disponible, 
  w.estado_bloqueo 
FROM wallet w 
INNER JOIN usuario u ON w.id_usuario = u.id_usuario 
INNER JOIN rol r ON u.id_rol = r.id_rol 
ORDER BY w.saldo_disponible DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    const dataSerializada = JSON.parse(JSON.stringify(data));
    return { success: true, data: dataSerializada, sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- USUARIOS GENERALES: Auditoría Administrativa ---
export async function fetchAuditoriaGeneral() {
  try {
    const sqlQuery = `SELECT 
  a.id_auditoria, 
  u.nombre AS admin_responsable, 
  a.entidad_afectada, 
  a.accion, 
  a.fecha_accion 
FROM auditoria_administrativa a 
INNER JOIN usuario u ON a.id_usuario_admin = u.id_usuario 
ORDER BY a.fecha_accion DESC 
LIMIT 50;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data, sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}



// --- ADMINISTRATIVO: Gestión de Solicitudes de Pago (Retiros) ---
export async function fetchTodasSolicitudesRetiro() {
  try {
    const sqlQuery = `SELECT 
      sr.id_retiro, 
      u.nombre AS chofer_nombre, 
      u.apellido AS chofer_apellido,
      sr.monto, 
      sr.estado, 
      sr.fecha_solicitud, 
      b.nombre_banco,
      sr.numero_cuenta
    FROM solicitud_retiro sr
    INNER JOIN wallet w ON sr.id_wallet = w.id_wallet
    INNER JOIN usuario u ON w.id_usuario = u.id_usuario
    INNER JOIN banco b ON sr.id_banco = b.id_banco
    ORDER BY sr.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}


// --- 1. ADMIN: Directorio General de Usuarios ---
export async function fetchDirectorioUsuarios() {
  try {
    const sqlQuery = `SELECT 
      u.id_usuario, 
      r.nombre AS rol,
      u.nombre, 
      u.apellido, 
      u.email, 
      u.telefono, 
      u.estado, 
      u.fecha_creacion 
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.id_rol
    ORDER BY u.fecha_creacion DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- 2. ADMIN: Monitor Global de Traslados ---
export async function fetchMonitorTrasladosGlobal() {
  try {
    const sqlQuery = `SELECT 
      t.id_traslado, 
      c.nombre AS cliente, 
      ch.nombre AS chofer, 
      v.placa,
      t.distancia_estimada_km,
      t.costo_estimado, 
      t.estado_actual, 
      t.fecha_solicitud 
    FROM traslado t
    LEFT JOIN usuario c ON t.id_cliente = c.id_usuario
    LEFT JOIN usuario ch ON t.id_chofer = ch.id_usuario
    LEFT JOIN vehiculo v ON t.id_vehiculo = v.id_vehiculo
    ORDER BY t.fecha_solicitud DESC
    LIMIT 100;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- 3. ADMIN: Control de Evaluaciones Psicológicas ---
export async function fetchControlEvaluaciones() {
  try {
    const sqlQuery = `SELECT 
      ep.id_evaluacion, 
      u.nombre AS chofer_nombre, 
      u.apellido AS chofer_apellido,
      c.estado_aprobacion,
      ep.calificacion, 
      ep.resultado, 
      ep.fecha_evaluacion,
      ep.fecha_vencimiento
    FROM evaluacion_psicologica ep
    INNER JOIN chofer c ON ep.id_chofer = c.id_usuario
    INNER JOIN usuario u ON c.id_usuario = u.id_usuario
    ORDER BY ep.fecha_evaluacion DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- 4. ADMIN: Gestión de Flota y Vencimientos ---
export async function fetchEstadoFlota() {
  try {
    const sqlQuery = `SELECT 
      v.id_vehiculo, 
      v.placa, 
      m.nombre AS marca, 
      v.modelo, 
      u.nombre AS propietario,
      v.estado,
      rv.calificacion AS nota_revision,
      rv.fecha_vencimiento
    FROM vehiculo v
    INNER JOIN marca m ON v.id_marca = m.id_marca
    INNER JOIN usuario u ON v.id_chofer = u.id_usuario
    LEFT JOIN revision_vehicular rv ON v.id_vehiculo = rv.id_vehiculo
    ORDER BY v.id_vehiculo DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- 5. ADMIN: Historial de Tarifas ---
export async function fetchHistorialTarifas() {
  try {
    const sqlQuery = `SELECT 
      id_tarifa, 
      precio_km, 
      tarifa_base, 
      tarifa_cancelacion,
      porcentaje_comision, 
      fecha_inicio_vigencia, 
      fecha_fin_vigencia 
    FROM tarifa 
    ORDER BY fecha_inicio_vigencia DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- 6. ADMIN: Validación de Recargas ---
export async function fetchValidacionRecargas() {
  try {
    const sqlQuery = `SELECT 
      r.id_recarga, 
      u.nombre AS cliente_nombre,
      u.apellido AS cliente_apellido,
      r.monto, 
      r.referencia_pago, 
      b.nombre_banco, 
      r.estado, 
      r.fecha_solicitud 
    FROM recarga r
    INNER JOIN wallet w ON r.id_wallet = w.id_wallet
    INNER JOIN usuario u ON w.id_usuario = u.id_usuario
    INNER JOIN banco b ON r.id_banco = b.id_banco
    ORDER BY r.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}



// --- CLIENTE: Historial de Recargas de Saldo ---
export async function fetchHistorialRecargasCliente(params?: Record<string, string>) {
  try {
    const clienteId = params?.id_cliente || '2';
    
    const sqlQuery = `SELECT 
    r.id_recarga, 
    r.monto, 
    r.referencia_pago, 
    r.estado, 
    r.fecha_solicitud, 
    b.nombre_banco
    FROM recarga r
    INNER JOIN wallet w ON r.id_wallet = w.id_wallet
    INNER JOIN banco b ON r.id_banco = b.id_banco
    WHERE w.id_usuario = ${clienteId}
    ORDER BY r.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CLIENTE: Historial de Viajes ---
export async function fetchHistorialViajesCliente(params?: Record<string, string>) {
  try {
    const clienteId = params?.id_cliente || '16';
    
    // Usamos LEFT JOIN para el chofer y el vehículo, porque si un viaje fue cancelado 
    // antes de ser asignado, podría no tener estos datos reales.
    const sqlQuery = `SELECT 
  t.id_traslado, 
  t.fecha_solicitud, 
  t.distancia_estimada_km, 
  t.costo_estimado, 
  t.estado_actual,
  u.nombre AS chofer_asignado,
  v.placa AS placa_vehiculo
FROM traslado t
LEFT JOIN chofer c ON t.id_chofer = c.id_usuario
LEFT JOIN usuario u ON c.id_usuario = u.id_usuario
LEFT JOIN vehiculo v ON t.id_vehiculo = v.id_vehiculo
WHERE t.id_cliente = ${clienteId}
ORDER BY t.fecha_solicitud DESC;`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CLIENTE: Detalles del Traslado Asignado (Seguridad) ---
export async function fetchDetalleTrasladoCliente(params?: Record<string, string>) {
  try {
    const trasladoId = params?.id_traslado || '1';
    
    // Consulta estricta (INNER JOIN) para extraer los datos de seguridad del chofer y vehículo
    const sqlQuery = `SELECT 
  t.id_traslado,
  t.estado_actual,
  u.nombre AS chofer_nombre,
  u.apellido AS chofer_apellido,
  u.telefono AS chofer_telefono,
  v.modelo,
  v.color,
  v.placa
FROM traslado t
INNER JOIN chofer c ON t.id_chofer = c.id_usuario
INNER JOIN usuario u ON c.id_usuario = u.id_usuario
INNER JOIN vehiculo v ON t.id_vehiculo = v.id_vehiculo
WHERE t.id_traslado = ${trasladoId};`;

    const data = await prisma.$queryRawUnsafe(sqlQuery);
    return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al ejecutar la consulta' };
  }
}

// --- CLIENTE: Perfil y Saldo de Wallet ---
export async function fetchPerfilYSaldoCliente(params?: Record<string, string>) {
    try {
      const clienteId = params?.id_cliente || '16';
  
      const sqlQuery = `SELECT 
        u.nombre, 
        u.apellido, 
        u.email, 
        u.telefono, 
        w.saldo_disponible, 
        w.moneda
      FROM usuario u
      LEFT JOIN wallet w ON u.id_usuario = w.id_usuario
      WHERE u.id_usuario = ${clienteId};`;
  
      const data = await prisma.$queryRawUnsafe(sqlQuery);
      return { success: true, data: JSON.parse(JSON.stringify(data)), sqlQuery };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al ejecutar la consulta' };
    }
  }