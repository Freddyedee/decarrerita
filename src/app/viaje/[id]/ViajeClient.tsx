"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, User, Phone, MapPin, Navigation, ShieldAlert, 
  CheckCircle2, Clock, AlertTriangle, Loader2, ArrowLeft, Star, DollarSign 
} from "lucide-react";
import MapaWrapper from "@/components/cliente/MapaWrapper";

interface ViajeClientProps {
  initialTraslado: any;
  usuarioId: number;
  rolUsuario: string;
}

export default function ViajeClient({ initialTraslado, usuarioId, rolUsuario }: ViajeClientProps) {
  const router = useRouter();
  const [traslado, setTraslado] = useState(initialTraslado);
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const esCliente = rolUsuario === "CLIENTE";
  const idTraslado = traslado.id || traslado.id_traslado;

  // 1. NORMALIZACIÓN SEGURA DE CAMPOS (Soporta Prisma snake_case y Dominio camelCase)
  const estadoActual = traslado.estadoActual ?? traslado.estado_actual ?? "PENDIENTE";
  const costoEstimado = Number(traslado.costoEstimado ?? traslado.costo_estimado ?? 0);
  const distanciaKm = Number(traslado.distanciaEstimadaKm ?? traslado.distancia_estimada_km ?? 0);

  // CORREGIDO: Se usan origenLat / origenLng / destinoLat / destinoLng que son las propiedades reales del Dominio
  const origenLat = Number(traslado.origenLat ?? traslado.origen_latitud ?? 0);
  const origenLng = Number(traslado.origenLng ?? traslado.origen_longitud ?? 0);
  const destinoLat = Number(traslado.destinoLat ?? traslado.destino_latitud ?? 0);
  const destinoLng = Number(traslado.destinoLng ?? traslado.destino_longitud ?? 0);

  // Poll periódico para sincronizar el estado del viaje entre Cliente y Chofer
  useEffect(() => {
    if (!idTraslado || isNaN(Number(idTraslado))) return;

    // Si el viaje ya finalizó o se canceló, no seguimos consultando
    if (["FINALIZADO", "COMPLETADO", "CANCELADO"].includes(estadoActual)) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/traslados/${idTraslado}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setTraslado(json.data);
            
            const nuevoEstado = json.data.estadoActual ?? json.data.estado_actual;
            if (["FINALIZADO", "COMPLETADO"].includes(nuevoEstado)) {
              router.push(`/calificar/${idTraslado}`);
            } else if (nuevoEstado === "CANCELADO") {
              router.push(esCliente ? "/cliente" : "/chofer");
            }
          }
        }
      } catch (err) {
        console.error("Error actualizando estado de viaje:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [idTraslado, router, esCliente, estadoActual]);  

  // Acciones del Chofer: Iniciar Viaje (CORREGIDO EL TYPO AQUÍ)
  const handleIniciarViaje = async () => {
    setLoadingAccion(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/traslados/${idTraslado}/iniciar`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "No se pudo iniciar el viaje");
      setTraslado((prev: any) => ({ ...prev, estado_actual: "EN_CURSO" }));
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingAccion(false);
    }
  };

  // Acciones del Chofer: Completar Viaje
  const handleCompletarViaje = async () => {
    setLoadingAccion(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/traslados/${idTraslado}/completar`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "No se pudo completar el viaje");
      router.push(`/calificar/${idTraslado}`);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingAccion(false);
    }
  };

  // Acción Cancelar Viaje (Disponible para ambos roles)
  const handleCancelarViaje = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar este traslado?")) return;
    setLoadingAccion(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/traslados/${idTraslado}/cancelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: usuarioId,
          actorRole: rolUsuario,
          motivo: "Cancelado desde pantalla de viaje"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "No se pudo cancelar el viaje");
      router.push(esCliente ? "/cliente" : "/chofer");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingAccion(false);
    }
  };

  // Extraemos datos de relaciones
  const choferUsuario = traslado.chofer?.usuario;
  const clienteUsuario = traslado.cliente?.usuario;
  const vehiculo = traslado.vehiculo;
  const marcaAuto = vehiculo?.marca?.nombre || "";

  // Preparamos datos del mapa
  const datosRutaMapa = {
    origen: [origenLat, origenLng] as [number, number],
    destino: [destinoLat, destinoLng] as [number, number],
    distanciaKm: distanciaKm
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-slate-100">
      
      {/* PANEL IZQUIERDO: DETALLES Y ACCIONES (Estilo Uber) */}
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-white h-full shadow-2xl border-r border-slate-200 flex flex-col justify-between p-6 overflow-y-auto z-20">
        
        <div className="space-y-6">
          {/* Encabezado de Estado */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 block tracking-wider">
                Traslado #{idTraslado}
              </span>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                {estadoActual === "SOLICITADO" && (
                  <span className="text-teal-600 flex items-center gap-1.5">
                    <Loader2 className="w-5 h-5 animate-spin" /> Buscando chofer cercano...
                  </span>)}
                {estadoActual === "ACEPTADO" && <span className="text-amber-500 flex items-center gap-1.5"><Clock className="w-5 h-5" /> Chofer Asignado</span>}
                {estadoActual === "EN_CAMINO" && <span className="text-blue-600 flex items-center gap-1.5"><Navigation className="w-5 h-5 animate-pulse" /> En Camino</span>}
                {estadoActual === "EN_CURSO" && <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5" /> Viaje en Curso</span>}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarifa Acordada</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">${costoEstimado.toFixed(2)}</span>
            </div>
          </div>

          {/* Alerta de Error */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VISTA CLIENTE: DATOS DEL CHOFER Y VEHÍCULO */}
          {esCliente ? (
            <div className="space-y-4">
              {/* Tarjeta del Chofer */}
              <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E7C86] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {choferUsuario?.nombre?.[0] || "C"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {choferUsuario ? `${choferUsuario.nombre} ${choferUsuario.apellido || ""}` : "Conductor Asignado"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(traslado.chofer?.puntaje_promedio || 5.0).toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({traslado.chofer?.viajes_completados || 0} viajes)</span>
                    </div>
                  </div>
                </div>

                {choferUsuario?.telefono && (
                  <a
                    href={`tel:${choferUsuario.telefono}`}
                    className="w-10 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Tarjeta del Vehículo */}
              {vehiculo && (
                <div className="bg-slate-900 text-white rounded-3xl p-4 space-y-2 border border-slate-800 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-teal-400" /> Vehículo
                    </span>
                    <span className="bg-amber-400 text-slate-950 font-mono font-black text-xs px-2.5 py-1 rounded-lg border border-amber-300">
                      {vehiculo.placa}
                    </span>
                  </div>
                  <div className="text-base font-extrabold tracking-tight">
                    {marcaAuto} {vehiculo.modelo} ({vehiculo.annio})
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                    <span>Color: <strong className="text-slate-200">{vehiculo.color || "No especificado"}</strong></span>
                    <span>•</span>
                    <span>Capacidad: <strong className="text-slate-200">{vehiculo.capacidad_pasajeros || 4} pas.</strong></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* VISTA CHOFER: DATOS DEL CLIENTE */
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {clienteUsuario?.nombre?.[0] || "P"}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Pasajero</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {clienteUsuario ? `${clienteUsuario.nombre} ${clienteUsuario.apellido || ""}` : "Cliente"}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{clienteUsuario?.email || ""}</p>
                </div>
              </div>

              {clienteUsuario?.telefono && (
                <a
                  href={`tel:${clienteUsuario.telefono}`}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Desglose de Trayecto */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#0E7C86] shrink-0 mt-1" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Origen</span>
                {/* CORREGIDO: Usamos origenLat y origenLng normalizados */}
                <p className="text-xs font-bold text-slate-800">
                  Lat: {origenLat.toFixed(4)}, Lng: {origenLng.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-slate-300 ml-2 h-4" />
            <div className="flex items-start gap-3">
              <Navigation className="w-4 h-4 text-rose-600 shrink-0 mt-1" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destino</span>
                {/* CORREGIDO: Usamos destinoLat y destinoLng normalizados */}
                <p className="text-xs font-bold text-slate-800">
                  Lat: {destinoLat.toFixed(4)}, Lng: {destinoLng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES DE CONTROL SEGÚN ROL Y ESTADO */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {!esCliente && (
            <>
              {["ACEPTADO", "EN_CAMINO"].includes(estadoActual) && (
                <button
                  type="button"
                  onClick={handleIniciarViaje}
                  disabled={loadingAccion}
                  className="w-full bg-[#0E7C86] hover:bg-[#095259] text-white font-black py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 text-sm transition-all transform active:scale-[0.98]"
                >
                  {loadingAccion ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                  Llegué por el Pasajero / Iniciar Viaje
                </button>
              )}

              {estadoActual === "EN_CURSO" && (
                <button
                  type="button"
                  onClick={handleCompletarViaje}
                  disabled={loadingAccion}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 text-sm transition-all transform active:scale-[0.98]"
                >
                  {loadingAccion ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Finalizar Viaje y Cobrar (${costoEstimado.toFixed(2)})
                </button>
              )}
            </>
          )}

          {esCliente && (
            <div className="bg-teal-50 border border-teal-200/80 p-3.5 rounded-2xl text-center space-y-1">
              <p className="text-xs font-extrabold text-[#0E7C86]">💬 Tu chofer está en camino</p>
              <p className="text-[11px] text-slate-500">Mantente atento a su llegada. La tarifa se debitará automáticamente de tu wallet.</p>
            </div>
          )}

          {/* Botón de Cancelación */}
          {["ACEPTADO", "EN_CAMINO"].includes(estadoActual) && (
            <button
              type="button"
              onClick={handleCancelarViaje}
              disabled={loadingAccion}
              className="w-full text-center text-xs font-bold text-rose-600 hover:text-rose-800 py-2.5 transition-colors block"
            >
              Cancelar este traslado
            </button>
          )}
        </div>

      </div>

      {/* PANEL DERECHO: MAPA A PANTALLA COMPLETA */}
      <div className="flex-1 h-full w-full relative z-10">
        <MapaWrapper onRutaCalculada={() => {}} />
      </div>

    </div>
  );
}