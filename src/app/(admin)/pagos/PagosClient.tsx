"use client";

import { useState } from "react";
import {
  Check,
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  DollarSign,
  Banknote,
} from "lucide-react";
import { aprobarRetiro } from "./actions";

export interface RetiroAdminDTO {
  id: number;
  chofertNombre: string;
  choferEmail: string;
  bancoNombre: string;
  monto: number;
  numeroCuenta: string;
  titularCuenta: string;
  estado: string;
  fechaSolicitud: string;
}

export function PagosClient({ initialRetiros }: { initialRetiros: RetiroAdminDTO[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("TODAS");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Filtrado dinámico por búsqueda o estatus
  const filteredRetiros = initialRetiros.filter((r) => {
    const matchesSearch =
      r.chofertNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.numeroCuenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bancoNombre.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterEstado === "TODAS") return matchesSearch;
    return matchesSearch && r.estado === filterEstado;
  });

  // Métricas rápidas
  const pendientesCount = initialRetiros.filter(r => r.estado === "PENDIENTE").length;
  const montoPendiente = initialRetiros
    .filter(r => r.estado === "PENDIENTE")
    .reduce((acc, curr) => acc + curr.monto, 0);

  const handleAprobar = async (id: number) => {
    if (!confirm("¿Deseas aprobar este retiro y procesar el pago al chofer?")) return;
    setLoadingId(id);
    setFeedback(null);

    const res = await aprobarRetiro(id);
    if (res.success) {
      setFeedback({ type: "success", msg: res.message! });
    } else {
      setFeedback({ type: "error", msg: res.error! });
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas en el estilo del Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white border border-[#E2E4E9] p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Retiros Pendientes</p>
            <p className="text-2xl font-bold text-slate-900">{pendientesCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E4E9] p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 rounded-lg text-[#0E7C86]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monto a Procesar</p>
            <p className="text-2xl font-bold text-slate-900">${montoPendiente.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E4E9] p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total de Solicitudes</p>
            <p className="text-2xl font-bold text-slate-900">{initialRetiros.length}</p>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          feedback.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-[#E2E4E9] rounded-xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por chofer, banco o cuenta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-[#E2E4E9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {["TODAS", "PENDIENTE", "APROBADA", "RECHAZADA"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterEstado(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterEstado === st
                  ? "bg-[#0E7C86] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="bg-white border border-[#E2E4E9] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-[#E2E4E9]">
              <tr>
                <th className="px-6 py-3 font-semibold">Chofer</th>
                <th className="px-6 py-3 font-semibold">Banco</th>
                <th className="px-6 py-3 font-semibold">Cuenta</th>
                <th className="px-6 py-3 font-semibold">Monto</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E9]">
              {filteredRetiros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No se encontraron solicitudes de retiro.
                  </td>
                </tr>
              ) : (
                filteredRetiros.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{r.chofertNombre}</p>
                      <p className="text-xs text-slate-400">{r.choferEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{r.bancoNombre}</td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-slate-800">
                        <p className="text-xs font-semibold">{r.numeroCuenta}</p>
                        <p className="text-xs text-slate-500">{r.titularCuenta}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">${r.monto.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{r.fechaSolicitud}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        r.estado === "APROBADA"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : r.estado === "PENDIENTE"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {r.estado === "APROBADA" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {r.estado === "PENDIENTE" && <Clock className="w-3.5 h-3.5" />}
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.estado === "PENDIENTE" ? (
                        <button
                          onClick={() => handleAprobar(r.id)}
                          disabled={loadingId === r.id}
                          className="inline-flex items-center gap-1 bg-[#0E7C86] hover:bg-[#0b636b] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {loadingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Aprobar
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Procesada</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
