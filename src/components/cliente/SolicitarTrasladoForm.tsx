"use client";

import { useState } from "react";

export default function SolicitarTrasladoForm() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Aquí conectaremos con el Server Action para calcular tarifa/crear traslado
    console.log("Solicitando traslado desde", origen, "hacia", destino);
    
    // Simulamos una carga temporal
    setTimeout(() => {
      setLoading(false);
      alert("¡Simulación: Traslado solicitado!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-[#E2E4E9] shadow-sm">
      
      {/* Input de Origen */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Punto de Partida</span>
        <input
          type="text"
          required
          placeholder="Ej: UNEG Sede Villa Asia"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
          className="border border-[#E2E4E9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
        />
      </label>

      {/* Input de Destino */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Destino</span>
        <input
          type="text"
          required
          placeholder="Ej: Orinokia Mall"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          className="border border-[#E2E4E9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
        />
      </label>

      {/* Botón de Acción */}
      <button
        type="submit"
        disabled={loading || !origen || !destino}
        className="mt-2 w-full bg-[#0E7C86] text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-[#0b636b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Calculando..." : "Solicitar Traslado"}
      </button>
    </form>
  );
}