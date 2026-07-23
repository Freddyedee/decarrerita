"use client";

import { useState } from "react";
import { registrarSolicitudRecarga } from "@/app/(cliente)/cliente/wallet/actions";

interface BancoDTO {
  id_banco: number;
  nombre: string;
}

interface RecargaFormProps {
  bancos: BancoDTO[];
}

export default function RecargaForm({ bancos }: RecargaFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(false);
    setMessage(null);

    // 1. Guardamos la referencia del formulario en una constante ANTES del await
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    setLoading(true);

    // 2. Esperamos a la base de datos
    const res = await registrarSolicitudRecarga(formData);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "" });
      // 3. Usamos la variable guardada para resetear los campos
      formElement.reset(); 
    } else {
      setMessage({ type: "error", text: res.error || "" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-[#E2E4E9] rounded-xl shadow-sm">
      <h3 className="font-display font-bold text-lg text-slate-900">Registrar Pago de Recarga</h3>
      <p className="text-xs text-slate-500">Reporta tu transferencia o pago móvil para ser validado por administración.</p>

      {/* Selector de Banco */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Banco Receptor</span>
        <select
          name="bancoId"
          required
          className="border border-[#E2E4E9] bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
        >
          <option value="">Selecciona un banco...</option>
          {bancos.map((banco) => (
            <option key={banco.id_banco} value={banco.id_banco}>
              {banco.nombre}
            </option>
          ))}
        </select>
      </label>

      {/* Monto */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 font-body">Monto ($)</span>
        <input
          name="monto"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          className="border border-[#E2E4E9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
        />
      </label>

      {/* Referencia de Pago */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Referencia de Pago</span>
        <input
          name="referencia"
          type="text"
          required
          placeholder="Número de comprobante"
          className="border border-[#E2E4E9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
        />
      </label>

      {message && (
        <div className={`p-3 text-sm rounded-md ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20"
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0E7C86] text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-[#0b636b] transition-colors disabled:opacity-50"
      >
        {loading ? "Enviando reporte..." : "Reportar Recarga"}
      </button>
    </form>
  );
}