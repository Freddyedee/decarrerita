"use client";

import dynamic from "next/dynamic";
import { DatosRuta } from "./MapaTraslado";

// Importación dinámica excluyendo el SSR (Server-Side Rendering)
const MapaSinSSR = dynamic(() => import("./MapaTraslado"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[450px] bg-slate-100 rounded-xl border border-slate-300 text-slate-500 animate-pulse">
      <span className="text-3xl mb-2">🗺️</span>
      <p className="text-sm font-medium">Cargando mapa interactivo de la ciudad...</p>
    </div>
  ),
});

export default function MapaWrapper({ onRutaCalculada }: { onRutaCalculada: (datos: DatosRuta) => void }) {
  return <MapaSinSSR onRutaCalculada={onRutaCalculada} />;
}