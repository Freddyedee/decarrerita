"use client";

import { useState, useEffect } from "react";
import { 
  History, Loader2, Calendar, MapPin, User, Star, 
  MessageSquare, AlertCircle, CheckCircle2, XCircle, 
  Car, Filter, X, Search, DollarSign, Activity, ShieldCheck 
} from "lucide-react";

interface Calificacion {
  id_calificacion: number;
  puntuacion: number;
  comentario?: string;
  calificador_es_cliente: boolean;
}

interface TrasladoAdmin {
  id_traslado: number;
  fecha_solicitud: string;
  distancia_estimada_km: number | string;
  costo_estimado: number | string;
  estado_actual: string;
  cliente?: {
    id_usuario?: number;
    rating_promedio?: number; // <--- En cliente
    usuario?: {
      nombre: string;
      apellido?: string;
      telefono?: string;
      email?: string;
    };
  };
  chofer?: {
    id_usuario?: number;
    licencia?: string;
    puntaje_promedio?: number; // <--- CORREGIDO AQUÍ TAMBIÉN
    usuario?: {
      nombre: string;
      apellido?: string;
      telefono?: string;
      email?: string;
    };
  };
  vehiculo?: {
    placa: string;
    modelo: string;
    color?: string;
  };
  calificacion?: Calificacion[];
}

export function AdminTrasladosClient() {
  const [traslados, setTraslados] = useState<TrasladoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "EN_CURSO" | "FINALIZADOS" | "CANCELADOS">("TODOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarHistorialAdmin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      const res = await fetch(`/api/admin/traslados?t=${Date.now()}`, { 
        cache: "no-store" 
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener el historial global de traslados.");
      }

      const resJson = await res.json();
      const lista: TrasladoAdmin[] = Array.isArray(resJson.data) ? resJson.data : Array.isArray(resJson) ? resJson : [];
      
      setTraslados(lista);
    } catch (error: any) {
      console.error("❌ [ADMIN TRASLADOS] Error:", error);
      setErrorMsg(error.message || "Error al cargar el directorio de viajes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorialAdmin();
  }, []);

  // Lógica combinada de filtrado: Estado + Rango de Fechas + Buscador de Texto
  const trasladosFiltrados = traslados.filter((t) => {
    const estado = (t.estado_actual || "").toUpperCase();
    const term = searchTerm.toLowerCase().trim();
    
    // 1. Filtro de Estado
    let pasaEstado = true;
    if (filtroEstado === "FINALIZADOS") {
      pasaEstado = estado === "FINALIZADO" || estado === "COMPLETADO";
    } else if (filtroEstado === "CANCELADOS") {
      pasaEstado = estado === "CANCELADO" || estado === "RECHAZADO";
    } else if (filtroEstado === "EN_CURSO") {
      pasaEstado = estado === "EN_CURSO" || estado === "ASIGNADO" || estado === "EN_CAMINO" || estado === "SOLICITADO";
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

    // 4. Filtro por Término de Búsqueda (ID, Placa, Cliente o Chofer)
    let pasaSearch = true;
    if (term) {
      const idStr = t.id_traslado.toString();
      const placa = (t.vehiculo?.placa || "").toLowerCase();
      const clienteNombre = `${t.cliente?.usuario?.nombre || ""} ${t.cliente?.usuario?.apellido || ""}`.toLowerCase();
      const clienteTel = (t.cliente?.usuario?.telefono || "").toLowerCase();
      const choferNombre = `${t.chofer?.usuario?.nombre || ""} ${t.chofer?.usuario?.apellido || ""}`.toLowerCase();
      const choferTel = (t.chofer?.usuario?.telefono || "").toLowerCase();

      pasaSearch = 
        idStr.includes(term) ||
        placa.includes(term) ||
        clienteNombre.includes(term) ||
        clienteTel.includes(term) ||
        choferNombre.includes(term) ||
        choferTel.includes(term);
    }

    return pasaEstado && pasaDesde && pasaHasta && pasaSearch;
  });

  // Cálculo de Métricas KPIs (basadas en los resultados filtrados actuales)
  const viajesCompletados = trasladosFiltrados.filter(
    t => (t.estado_actual || "").toUpperCase() === "FINALIZADO" || (t.estado_actual || "").toUpperCase() === "COMPLETADO"
  );
  
  const volumenMovido = viajesCompletados.reduce((acc, t) => acc + Number(t.costo_estimado || 0), 0);
  
  // Promedio global de calificaciones en el periodo
  const todasLasCalificaciones = viajesCompletados.flatMap(t => t.calificacion || []);
  const promedioGeneral = todasLasCalificaciones.length > 0
    ? (todasLasCalificaciones.reduce((acc, c) => acc + c.puntuacion, 0) / todasLasCalificaciones.length).toFixed(1)
    : "N/A";

  const limpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
    setSearchTerm("");
    setFiltroEstado("TODOS");
  };

  const obtenerBadgeEstado = (estado: string) => {
    const est = (estado || "").toUpperCase();
    if (est === "FINALIZADO" || est === "COMPLETADO") {
      return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-black">{est}</span>;
    }
    if (est === "CANCELADO" || est === "RECHAZADO") {
      return <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-black">{est}</span>;
    }
    return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-black">{est}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado y Tarjetas de Métricas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#0E7C86] flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Viajes en Periodo</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{trasladosFiltrados.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Volumen Generado</span>
            <div className="text-2xl font-black text-emerald-600 font-mono">USD {volumenMovido.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Satisfacción General</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{promedioGeneral} <span className="text-xs font-normal text-slate-400">/ 5.0</span></div>
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

      {/* BARRA DE AUDITORÍA: Buscador general + Filtro por Fechas */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Buscador general */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID, placa, cliente o chofer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86] transition-all font-medium"
            />
          </div>

          {/* Selector de Rango de Fechas */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl">
              <span className="text-slate-400 font-bold">Desde:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="bg-transparent font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl">
              <span className="text-slate-400 font-bold">Hasta:</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="bg-transparent font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            {(fechaDesde || fechaHasta || searchTerm || filtroEstado !== "TODOS") && (
              <button
                onClick={limpiarFiltros}
                title="Limpiar todos los filtros"
                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl border border-rose-100 transition-colors flex items-center gap-1 font-bold flex-shrink-0"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Pestañas de Estado */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 overflow-x-auto">
          <button
            onClick={() => setFiltroEstado("TODOS")}
            className={`flex-1 min-w-[100px] py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "TODOS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroEstado("EN_CURSO")}
            className={`flex-1 min-w-[120px] py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "EN_CURSO" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            En Curso / Pendientes
          </button>
          <button
            onClick={() => setFiltroEstado("FINALIZADOS")}
            className={`flex-1 min-w-[100px] py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "FINALIZADOS" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Completados
          </button>
          <button
            onClick={() => setFiltroEstado("CANCELADOS")}
            className={`flex-1 min-w-[100px] py-2 rounded-xl font-extrabold text-xs transition-all flex justify-center items-center gap-1.5 ${
              filtroEstado === "CANCELADOS" ? "bg-white text-rose-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-4 h-4" /> Cancelados
          </button>
        </div>
      </div>

      {/* Lista de Traslados para Auditoría */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin" />
          <p className="text-slate-400 font-medium text-sm">Consultando registros de auditoría...</p>
        </div>
      ) : trasladosFiltrados.length > 0 ? (
        <div className="space-y-4">
          {trasladosFiltrados.map((v) => {
            const califCliente = v.calificacion?.find(c => c.calificador_es_cliente === true);
            const califChofer = v.calificacion?.find(c => c.calificador_es_cliente === false);

            return (
              <div
                key={v.id_traslado}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* Header superior del Traslado */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xs px-3 py-1 rounded-xl bg-slate-900 text-white">
                      #{v.id_traslado}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(v.fecha_solicitud).toLocaleString("es-VE")}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    {obtenerBadgeEstado(v.estado_actual)}
                    <span className="text-lg font-black font-mono text-slate-900">
                      USD {Number(v.costo_estimado || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Grid con Información de Partes (Cliente vs Chofer) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs">
                  {/* Bloque Cliente */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-slate-200/60 pb-1 mb-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>CLIENTE</span>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {v.cliente?.usuario ? `${v.cliente.usuario.nombre} ${v.cliente.usuario.apellido || ""}` : "Desconocido"}
                    </div>
                    <div className="font-mono text-slate-500">{v.cliente?.usuario?.telefono || "Sin teléfono"}</div>
                  </div>

                  {/* Bloque Chofer y Vehículo */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-slate-200/60 pb-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>CHOFER Y VEHÍCULO</span>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {v.chofer?.usuario ? `${v.chofer.usuario.nombre} ${v.chofer.usuario.apellido || ""}` : "Por Asignar"}
                    </div>
                    <div className="flex items-center gap-1 font-mono text-slate-500">
                      <Car className="w-3 h-3 text-slate-400" />
                      <span>{v.vehiculo ? `${v.vehiculo.modelo} (${v.vehiculo.placa})` : "Sin vehículo"}</span>
                    </div>
                  </div>

                  {/* Bloque de Evaluaciones Cruzadas */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 text-[10px] uppercase">Cliente calificó:</span>
                      {califCliente ? (
                        <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-black font-mono text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{califCliente.puntuacion}/5</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Pendiente</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                      <span className="font-bold text-slate-500 text-[10px] uppercase">Chofer calificó:</span>
                      {califChofer ? (
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-black font-mono text-[11px]">
                          <Star className="w-3 h-3 fill-blue-400 text-blue-500" />
                          <span>{califChofer.puntuacion}/5</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Pendiente</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comentarios de Auditoría (Si existen) */}
                {(califCliente?.comentario || califChofer?.comentario) && (
                  <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-800 block">Comentarios del Servicio:</span>
                    {califCliente?.comentario && (
                      <p className="text-slate-700 italic flex items-start gap-1">
                        <span className="font-bold text-slate-900">Cliente:</span> "{califCliente.comentario}"
                      </p>
                    )}
                    {califChofer?.comentario && (
                      <p className="text-slate-700 italic flex items-start gap-1">
                        <span className="font-bold text-slate-900">Chofer:</span> "{califChofer.comentario}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No se encontraron registros</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Ningún traslado coincide con los criterios de búsqueda, estado o rango de fechas seleccionados.
          </p>
          {(fechaDesde || fechaHasta || searchTerm || filtroEstado !== "TODOS") && (
            <button
              onClick={limpiarFiltros}
              className="text-xs font-bold text-[#0E7C86] underline block mx-auto mt-2"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}