"use client";

import { useState, useEffect } from "react";
import { 
  History, Loader2, Calendar, MapPin, 
  User, Star, MessageSquare, AlertCircle, CheckCircle2, 
  XCircle, Car, Filter, X 
} from "lucide-react";

interface Calificacion {
  id_calificacion: number;
  puntuacion: number;
  comentario?: string;
  calificador_es_cliente: boolean;
}

interface TrasladoHistorial {
  id_traslado: number;
  fecha_solicitud: string;
  distancia_estimada_km: number | string;
  costo_estimado: number | string;
  estado_actual: string;
  cliente?: {
    id_usuario?: number;
    rating_promedio?: number;
    usuario?: {
      nombre: string;
      apellido?: string;
      telefono?: string;
    };
  };
  vehiculo?: {
    placa: string;
    modelo: string;
  };
  calificacion?: Calificacion[];
}

export default function ChoferHistorialClient({ choferId }: { choferId: number }) {
  const [traslados, setTraslados] = useState<TrasladoHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados de Filtros
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "FINALIZADOS" | "CANCELADOS">("FINALIZADOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      const res = await fetch(`/api/traslados/chofer/${choferId}?t=${Date.now()}`, { 
        cache: "no-store" 
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener el historial del servidor.");
      }

      const resJson = await res.json();
      const lista: TrasladoHistorial[] = Array.isArray(resJson.data) ? resJson.data : Array.isArray(resJson) ? resJson : [];
      
      setTraslados(lista);
    } catch (error: any) {
      console.error("❌ [HISTORIAL] Error:", error);
      setErrorMsg(error.message || "Error al cargar el historial de viajes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (choferId) {
      cargarHistorial();
    }
  }, [choferId]);

  // Lógica combinada de filtrado: Estado + Rango de Fechas
  const trasladosFiltrados = traslados.filter((t) => {
    const estado = (t.estado_actual || "").toUpperCase();
    
    // 1. Filtro de Estado
    let pasaEstado = true;
    if (filtroEstado === "FINALIZADOS") {
      pasaEstado = estado === "FINALIZADO" || estado === "COMPLETADO";
    } else if (filtroEstado === "CANCELADOS") {
      pasaEstado = estado === "CANCELADO" || estado === "RECHAZADO";
    }

    // 2. Filtro de Fecha Desde
    let pasaDesde = true;
    if (fechaDesde) {
      const fechaViaje = new Date(t.fecha_solicitud).getTime();
      const limiteDesde = new Date(`${fechaDesde}T00:00:00`).getTime();
      pasaDesde = fechaViaje >= limiteDesde;
    }

    // 3. Filtro de Fecha Hasta
    let pasaHasta = true;
    if (fechaHasta) {
      const fechaViaje = new Date(t.fecha_solicitud).getTime();
      const limiteHasta = new Date(`${fechaHasta}T23:59:59`).getTime();
      pasaHasta = fechaViaje <= limiteHasta;
    }

    return pasaEstado && pasaDesde && pasaHasta;
  });

  // Cálculo de estadísticas dinámicas (basadas en los filtros actuales)
  const totalGanado = trasladosFiltrados
    .filter(t => (t.estado_actual || "").toUpperCase() === "FINALIZADO" || (t.estado_actual || "").toUpperCase() === "COMPLETADO")
    .reduce((acc, t) => acc + Number(t.costo_estimado || 0), 0);

  const totalViajesCompletados = trasladosFiltrados.filter(
    t => (t.estado_actual || "").toUpperCase() === "FINALIZADO" || (t.estado_actual || "").toUpperCase() === "COMPLETADO"
  ).length;

  const limpiarFechas = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Encabezado y Estadísticas Dinámicas */}
      <div className="bg-gradient-to-r from-[#0E7C86] to-[#095259] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <History className="w-7 h-7 text-teal-200" /> Historial de Traslados
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Consulta tus servicios prestados, ganancias y evaluaciones de clientes.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 w-full md:w-auto justify-around">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Viajes (Periodo)</span>
            <span className="text-xl font-black font-mono">{totalViajesCompletados}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Generado (Periodo)</span>
            <span className="text-xl font-black font-mono text-emerald-300">${totalGanado.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Alerta de Error */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PANEL DE FILTROS: Estado + Rango de Fechas */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Pestañas de Estado */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setFiltroEstado("FINALIZADOS")}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "FINALIZADOS" ? "bg-white text-[#0E7C86] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Completados
          </button>
          <button
            onClick={() => setFiltroEstado("CANCELADOS")}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "CANCELADOS" ? "bg-white text-rose-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-4 h-4" /> Cancelados
          </button>
          <button
            onClick={() => setFiltroEstado("TODOS")}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "TODOS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Todos
          </button>
        </div>

        {/* Selector de Rango de Fechas */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto text-slate-700 font-bold">
            <Filter className="w-4 h-4 text-[#0E7C86]" />
            <span>Periodo:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex-1 sm:flex-initial">
              <span className="text-slate-400 font-medium">Desde:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex-1 sm:flex-initial">
              <span className="text-slate-400 font-medium">Hasta:</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            {(fechaDesde || fechaHasta) && (
              <button
                onClick={limpiarFechas}
                title="Limpiar filtro de fechas"
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors flex items-center gap-1 font-bold"
              >
                <X className="w-4 h-4" />
                <span className="hidden md:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Traslados */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin" />
          <p className="text-slate-400 font-medium text-sm">Consultando tu libro de viajes...</p>
        </div>
      ) : trasladosFiltrados.length > 0 ? (
        <div className="space-y-4">
          {trasladosFiltrados.map((v) => {
            const esFinalizado = (v.estado_actual || "").toUpperCase() === "FINALIZADO" || (v.estado_actual || "").toUpperCase() === "COMPLETADO";
            const calificacionCliente = v.calificacion?.find(c => c.calificador_es_cliente === true);

            return (
              <div
                key={v.id_traslado}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      Traslado #{v.id_traslado}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(v.fecha_solicitud).toLocaleString("es-VE")}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black font-mono text-slate-900 block">
                      ${Number(v.costo_estimado || 0).toFixed(2)}
                    </span>
                    <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                      esFinalizado ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {v.estado_actual}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-4 h-4 text-[#0E7C86] flex-shrink-0" />
                      <span className="font-bold">Cliente:</span>
                      <span>
                        {v.cliente?.usuario ? 
                          `${v.cliente.usuario.nombre} ${v.cliente.usuario.apellido || ""}` : 
                          "Cliente registrado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>Distancia recorrida: <strong>{Number(v.distancia_estimada_km || 0).toFixed(1)} km</strong></span>
                    </div>
                    {v.vehiculo && (
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Vehículo: {v.vehiculo.modelo} ({v.vehiculo.placa})</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    {calificacionCliente ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-slate-500">Evaluación del Cliente</span>
                          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-black font-mono text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{calificacionCliente.puntuacion} / 5</span>
                          </div>
                        </div>
                        {calificacionCliente.comentario && (
                          <p className="text-xs text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200/60 flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>"{calificacionCliente.comentario}"</span>
                          </p>
                        )}
                      </div>
                    ) : esFinalizado ? (
                      <div className="text-center py-2 text-slate-400 text-xs">
                        <Star className="w-4 h-4 mx-auto mb-1 text-slate-300" />
                        <span>El cliente aún no ha calificado este viaje.</span>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-slate-400 text-xs italic">
                        Sin evaluación (Viaje no completado)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No se encontraron traslados</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            No tienes registros que coincidan con los filtros y el rango de fechas seleccionado.
          </p>
          {(fechaDesde || fechaHasta) && (
            <button
              onClick={limpiarFechas}
              className="text-xs font-bold text-[#0E7C86] underline block mx-auto mt-2"
            >
              Limpiar filtro de fechas
            </button>
          )}
        </div>
      )}
    </div>
  );
}