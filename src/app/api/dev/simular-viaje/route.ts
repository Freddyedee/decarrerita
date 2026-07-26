import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { EstadoTraslado } from "@/modules/Traslado/domain/Enum/EstadoTraslado";

export async function POST(req: NextRequest) {
  try {
    const { clienteId = 11, choferId = 15, tarifaId = 1 } = await req.json().catch(() => ({}));

    console.log(`🚀 [DEV SIMULADOR] Iniciando viaje express: Cliente ${clienteId} -> Chofer ${choferId}`);

    // 1. Crear el viaje directamente en SOLICITADO
    const nuevoViaje = await prisma.traslado.create({
      data: {
        id_cliente: Number(clienteId),
        id_chofer: Number(choferId),
        id_vehiculo: 4, // Vehículo activo de prueba
        id_tarifa: Number(tarifaId),
        origen_latitud: 8.290000,
        origen_longitud: -62.720000,
        destino_latitud: 8.310000,
        destino_longitud: -62.700000,
        distancia_estimada_km: 5.0,
        costo_estimado: 10.00, // $10 exactos para ver el 70/30 fácil
        estado_actual: EstadoTraslado.SOLICITADO,
      },
    });

    const id = nuevoViaje.id_traslado;
    console.log(`📍 [DEV SIMULADOR] Viaje #${id} creado. Aceptando...`);

    // 2. Pasar a EN_CAMINO (Chofer acepta)
    await prisma.traslado.update({
      where: { id_traslado: id },
      data: { estado_actual: EstadoTraslado.EN_CAMINO },
    });

    // 3. Pasar a EN_CURSO (Llamamos a tu endpoint real o actualizamos para cobrar al cliente)
    // Para que ejecute tu lógica financiera real, hacemos un fetch interno a tus propios endpoints:
    const baseUrl = req.nextUrl.origin;
    
    console.log(`💸 [DEV SIMULADOR] Viaje #${id} en camino. Disparando cobro al cliente (/iniciar)...`);
    const resIniciar = await fetch(`${baseUrl}/api/traslados/${id}/iniciar`, { method: "POST" });
    if (!resIniciar.ok) throw new Error(`Falló al iniciar: ${await resIniciar.text()}`);

    console.log(`💰 [DEV SIMULADOR] Viaje #${id} en curso. Disparando pago al chofer (/completar)...`);
    const resCompletar = await fetch(`${baseUrl}/api/traslados/${id}/completar`, { method: "POST" });
    if (!resCompletar.ok) throw new Error(`Falló al completar: ${await resCompletar.text()}`);

    return NextResponse.json({
      success: true,
      message: `¡Viaje #${id} completado en tiempo récord! Revisa las wallets en BD.`,
      trasladoId: id,
    });
  } catch (error) {
    console.error("❌ [DEV SIMULADOR] Error en la simulación:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}