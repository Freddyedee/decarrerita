"use client";

import { useState, useEffect } from "react";
import MapaWrapper from "@/components/cliente/MapaWrapper";
import { DatosRuta } from "@/components/cliente/MapaTraslado";
import { solicitarNuevoTraslado, cotizarViaje } from "./actions";
import { Car, Loader2, MapPin, Navigation, ShieldCheck, DollarSign, CheckCircle2, X } from "lucide-react";

export default function ClienteDashboardPage() {
  const [datosRuta, setDatosRuta] = useState<DatosRuta>({
    origen: null,
    destino: null,
    distanciaKm: 0,
  });

  const [cotizacion, setCotizacion] = useState<{ costo: number; desglose: string } | null>(null);
  const [loadingCotizacion, setLoadingCotizacion] = useState(false);
  const [loadingSolicitud, setLoadingSolicitud] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // EFECTO: Cada vez que el mapa traza una ruta nueva (> 0 km), cotizamos automáticamente
  useEffect(() => {
    async function calcularTarifa() {
      if (datosRuta.distanciaKm > 0 && datosRuta.origen && datosRuta.destino) {
        setLoadingCotizacion(true);
        setFeedback(null);
        const res = await cotizarViaje(datosRuta.distanciaKm);
        if (res.success) {
          setCotizacion({ costo: res.costo!, desglose: res.desglose! });
        } else {
          setFeedback({ type: "error", text: res.error! });
        }
        setLoadingCotizacion(false);
      } else {
        setCotizacion(null);
      }
    }
    calcularTarifa();
  }, [datosRuta.distanciaKm, datosRuta.origen, datosRuta.destino]);

  // MANEJADOR: Cuando el cliente presiona "Confirmar y Pedir Chofer"
  async function handleConfirmarViaje() {
    if (!datosRuta.origen || !datosRuta.destino || !cotizacion) return;

    setLoadingSolicitud(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("origenlat", datosRuta.origen[0].toString());
    formData.append("origenlng", datosRuta.origen[1].toString());
    formData.append("destinolat", datosRuta.destino[0].toString());
    formData.append("destinolng", datosRuta.destino[1].toString());
    formData.append("distanciaEstimadaKm", datosRuta.distanciaKm.toString());

    const res = await solicitarNuevoTraslado(formData);

    if (res.success) {
      setFeedback({ type: "success", text: res.message! });
      // Reiniciamos todo tras una solicitud exitosa
      setDatosRuta({ origen: null, destino: null, distanciaKm: 0 });
      setCotizacion(null);
    } else {
      setFeedback({ type: "error", text: res.error! });
    }
    setLoadingSolicitud(false);
  }

  return (
    <div className="flex flex-col h-full gap-6 lg:flex-row">
      {/* Columna Izquierda: Controles y Tarjeta de Cotización */}
      <div className="flex w-full flex-col gap-6 lg:w-1/3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            ¿A dónde vamos hoy?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Haz clic en el mapa para marcar tu partida (A) y destino (B).
          </p>
        </div>

        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-[#E2E4E9] shadow-sm">
          {/* Muestra de Origen */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0E7C86]" /> Punto de Partida
            </span>
            <div className="border border-[#E2E4E9] bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium truncate">
              {datosRuta.origen ? `Lat: ${datosRuta.origen[0].toFixed(4)}, Lng: ${datosRuta.origen[1].toFixed(4)}` : "Selecciona en el mapa..."}
            </div>
          </div>

          {/* Muestra de Destino */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#C0392B]" /> Destino
            </span>
            <div className="border border-[#E2E4E9] bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium truncate">
              {datosRuta.destino ? `Lat: ${datosRuta.destino[0].toFixed(4)}, Lng: ${datosRuta.destino[1].toFixed(4)}` : "Selecciona en el mapa..."}
            </div>
          </div>

          {/* ESTADO 1: Cargando Cotización */}
          {loadingCotizacion && (
            <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl flex items-center justify-center gap-2 text-sm text-[#0E7C86] font-medium animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> Calculando mejor tarifa...
            </div>
          )}

          {/* ESTADO 2: BOLETO DE COTIZACIÓN (Listo para confirmar) */}
          {cotizacion && !loadingCotizacion && (
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-md space-y-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Tarifa Estimada</span>
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">${cotizacion.costo.toFixed(2)}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-1 rounded font-mono font-bold">
                  {datosRuta.distanciaKm} km
                </span>
              </div>
              
              <p className="text-xs text-slate-300 font-sans italic">
                ℹ️ {cotizacion.desglose}
              </p>

              {/* Botón de Confirmación Definitiva */}
              <button
                type="button"
                onClick={handleConfirmarViaje}
                disabled={loadingSolicitud}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50"
              >
                {loadingSolicitud ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> Asignando chofer...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" /> Confirmar y Pedir Chofer
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setDatosRuta({ origen: null, destino: null, distanciaKm: 0 });
                  setCotizacion(null);
                }}
                disabled={loadingSolicitud}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors py-1 block"
              >
                Cancelar / Elegir otra ruta
              </button>
            </div>
          )}

          {/* Alertas y Feedbacks */}
          {feedback && (
            <div className={`p-3 text-xs rounded-lg font-medium flex items-start gap-2 ${
              feedback.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}>
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Mapa Interactivo */}
      <div className="flex-1 w-full min-h-[450px]">
        <MapaWrapper onRutaCalculada={(datos) => setDatosRuta(datos)} />
      </div>
    </div>
  );
}