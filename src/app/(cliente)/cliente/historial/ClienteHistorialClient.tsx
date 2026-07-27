"use client";

import { useState, useEffect } from "react";
import { 
  History, Car, Wallet, Calendar, MapPin, User, 
  Star, MessageSquare, Loader2, Filter, X, CheckCircle2, AlertCircle 
} from "lucide-react";

interface Calificacion {
  id_calificacion: number;
  puntuacion: number;
  comentario?: string;
  calificador_es_cliente: boolean;
}

interface TrasladoCliente {
  id_traslado: number;
  fecha_solicitud: string;
  distancia_estimada_km: number | string;
  costo_estimado: number | string;
  estado_actual: string;
  chofer?: {
    id_usuario?: number;
    licencia?: string;
    usuario?: {
      nombre: string;
      apellido?: string;
      telefono?: string;
    };
  };
  vehiculo?: {
    placa: string;
    modelo: string;
    color?: string;
  };
  calificacion?: Calificacion[];
}

interface RecargaCliente {
  id: number | string;
  fechaSolicitud: string | Date;
  referenciaPago: string;
  monto: number;
  status: string;
}

function formatearFecha(fecha: string | Date) {
  if (!fecha) return "N/A";
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

function obtenerEstiloEstado(estado: string) {
  const est = (estado || "").toUpperCase();
  switch (est) {
    case "APROBADA":
    case "FINALIZADO":
    case "COMPLETADO":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PENDIENTE":
    case "SOLICITADO":
    case "ASIGNADO":
    case "EN_CAMINO":
    case "EN_CURSO":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "RECHAZADA":
    case "CANCELADO":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function ClienteHistorialClient({
  clienteId,
  initialRecargas = [],
}: {
  clienteId: number;
  initialRecargas?: RecargaCliente[];
}) {
  const [tabActiva, setTabActiva] = useState<"TRASLADOS" | "RECARGAS">("TRASLADOS");
  const [traslados, setTraslados] = useState<TrasladoCliente[]>([]);
  const [recargas] = useState<RecargaCliente[]>(initialRecargas);
  const [loadingTraslados, setLoadingTraslados] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filtros por Fecha
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    const cargarTraslados = async () => {
      try {
        setLoadingTraslados(true);
        setErrorMsg("");
        const res = await fetch(`/api/traslados/cliente/${clienteId}?t=${Date.now()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Error al obtener los traslados del servidor.");
        }

        const resJson = await res.json();
        const lista: TrasladoCliente[] = Array.isArray(resJson.data)
          ? resJson.data
          : Array.isArray(resJson)
          ? resJson
          : [];
        setTraslados(lista);
      } catch (err: any) {
        console.error("Error cargando traslados:", err);
        setErrorMsg(err.message);
      } finally {
        setLoadingTraslados(false);
      }
    };

    if (clienteId) {
      cargarTraslados();
    }
  }, [clienteId]);

  // Filtrado por Fecha en Traslados
  const trasladosFiltrados = traslados.filter((t) => {
    let pasaDesde = true;
    if (fechaDesde) {
      const fecha = new Date(t.fecha_solicitud).getTime();
      const limiteDesde = new Date(`${fechaDesde}T00:00:00`).getTime();
      pasaDesde = fecha >= limiteDesde;
    }
    let pasaHasta = true;
    if (fechaHasta) {
      const fecha = new Date(t.fecha_solicitud).getTime();
      const limiteHasta = new Date(`${fechaHasta}T23:59:59`).getTime();
      pasaHasta = fecha <= limiteHasta;
    }
    return pasaDesde && pasaHasta;
  });

  // Filtrado por Fecha en Recargas
  const recargasFiltradas = recargas.filter((r) => {
    let pasaDesde = true;
    if (fechaDesde) {
      const fecha = new Date(r.fechaSolicitud).getTime();
      const limiteDesde = new Date(`${fechaDesde}T00:00:00`).getTime();
      pasaDesde = fecha >= limiteDesde;
    }
    let pasaHasta = true;
    if (fechaHasta) {
      const fecha = new Date(r.fechaSolicitud).getTime();
      const limiteHasta = new Date(`${fechaHasta}T23:59:59`).getTime();
      pasaHasta = fecha <= limiteHasta;
    }
    return pasaDesde && pasaHasta;
  });

  const limpiarFechas = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 p-4">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-7 h-7 text-[#0E7C86]" /> Mis Movimientos
          </h1>
          <p className="text-sm text-slate-500">
            Consulta el historial de tus viajes solicitados y recargas de saldo.
          </p>
        </div>

        {/* Pestañas (Tabs) */}
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl gap-1 w-full md:w-auto">
          <button
            onClick={() => setTabActiva("TRASLADOS")}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
              tabActiva === "TRASLADOS"
                ? "bg-white text-[#0E7C86] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-4 h-4" /> Traslados ({traslados.length})
          </button>
          <button
            onClick={() => setTabActiva("RECARGAS")}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
              tabActiva === "RECARGAS"
                ? "bg-white text-[#0E7C86] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4" /> Recargas ({recargas.length})
          </button>
        </div>
      </div>

      {/* Control del Rango de Fechas */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#0E7C86]" />
          <span>Filtrar por periodo:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex-1 sm:flex-initial">
            <span className="text-slate-400 font-medium">Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex-1 sm:flex-initial">
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
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors flex items-center gap-1 font-bold"
            >
              <X className="w-4 h-4" />
              <span className="hidden md:inline">Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CONTENIDO 1: TRASLADOS */}
      {tabActiva === "TRASLADOS" && (
        <>
          {loadingTraslados ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin mb-3" />
              <p className="text-slate-400 font-medium text-sm">Consultando tu historial de viajes...</p>
            </div>
          ) : trasladosFiltrados.length > 0 ? (
            <div className="space-y-4">
              {trasladosFiltrados.map((t) => {
                const choferUsuario = t.chofer?.usuario;
                const calificacionChofer = t.calificacion?.find(
                  (c) => c.calificador_es_cliente === false
                );
                const miCalificacion = t.calificacion?.find(
                  (c) => c.calificador_es_cliente === true
                );

                return (
                  <div
                    key={t.id_traslado}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                          Traslado #{t.id_traslado}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatearFecha(t.fecha_solicitud)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black font-mono text-slate-900 block">
                          ${Number(t.costo_estimado || 0).toFixed(2)}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border mt-1 ${obtenerEstiloEstado(
                            t.estado_actual
                          )}`}
                        >
                          {t.estado_actual}
                        </span>
                      </div>
                    </div>

                    {/* Detalle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-xs">
                      <div className="space-y-1.5 text-slate-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#0E7C86] flex-shrink-0" />
                          <span className="font-bold">Chofer:</span>
                          <span>
                            {choferUsuario
                              ? `${choferUsuario.nombre} ${choferUsuario.apellido || ""}`
                              : "Chofer asignado"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>
                            Distancia: <strong>{Number(t.distancia_estimada_km || 0).toFixed(1)} km</strong>
                          </span>
                        </div>
                        {t.vehiculo && (
                          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                            <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>
                              Vehículo: {t.vehiculo.modelo} ({t.vehiculo.placa})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Calificación */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                        {miCalificacion ? (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">Tu Evaluación</span>
                              <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-mono font-black">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>{miCalificacion.puntuacion} / 5</span>
                              </div>
                            </div>
                            {miCalificacion.comentario && (
                              <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200/60 flex items-start gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span>"{miCalificacion.comentario}"</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-center text-slate-400 text-xs py-1">
                            Sin calificación registrada por ti.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <Car className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No tienes traslados registrados</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                No encontramos traslados que coincidan con el periodo de tiempo seleccionado.
              </p>
            </div>
          )}
        </>
      )}

      {/* CONTENIDO 2: RECARGAS DE SALDO */}
      {tabActiva === "RECARGAS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {recargasFiltradas.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm space-y-2">
              <Wallet className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No hay recargas en este rango de fechas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Referencia</th>
                    <th className="px-6 py-4">Monto</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recargasFiltradas.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {formatearFecha(r.fechaSolicitud)}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {r.referenciaPago}
                      </td>
                      <td className="px-6 py-4 font-mono font-black text-emerald-600">
                        +${Number(r.monto).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${obtenerEstiloEstado(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}