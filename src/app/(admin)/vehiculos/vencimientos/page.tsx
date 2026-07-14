"use client";

import { useState, useEffect } from "react";

interface VehiculoConVencimiento {
    vehicleId: number;
    plate: string;
    model: string;
    driverId: number;
    ultimaRevisionFecha: string | null;
    fechaVencimiento: string | null;
    diasParaVencer: number | null;
    estado: "sin_revision" | "vencida" | "por_vencer" | "vigente";
}

/* ============================================================
 * 🎨 BLOQUE DE ESTILOS SEMÁNTICOS
 * ============================================================ */
const ESTADO_VENCIMIENTO_ESTILOS: Record<VehiculoConVencimiento["estado"], { label: string; className: string }> = {
    vencida:       { label: "Vencida",        className: "bg-red-500/10 text-red-700 border-red-500/20" },
    por_vencer:    { label: "Por vencer",     className: "bg-amber-500/15 text-amber-800 border-amber-500/20" },
    vigente:       { label: "Vigente",        className: "bg-teal-500/10 text-teal-700 border-teal-500/20" },
    sin_revision:  { label: "Sin revisión",   className: "bg-slate-500/10 text-slate-600 border-slate-500/15" },
};

function VencimientoPill({ estado }: { estado: VehiculoConVencimiento["estado"] }) {
    const config = ESTADO_VENCIMIENTO_ESTILOS[estado];
    return (
        <span className={`inline-flex items-center text-xs font-medium font-mono px-2.5 py-0.5 rounded-full border ${config.className}`}>
            {config.label}
        </span>
    );
}

export default function VencimientosPage() {
    const [datos, setDatos] = useState<VehiculoConVencimiento[]>([]);
    const [cargando, setCargando] = useState(true);

    async function cargarVencimientos() {
        setCargando(true);
        try {
            const res = await fetch("/api/vehicles/vencimientos");
            const json = await res.json();
            setDatos(json.data ?? []);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarVencimientos();
    }, []);

    const urgentes = datos.filter(d => d.estado === "vencida" || d.estado === "por_vencer");

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            
            {/* ENCABEZADO */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Vencimientos de revisión técnica
                </h1>
                <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                    La revisión técnica es válida por un año. Aquí se listan primero los
                    vehículos vencidos o próximos a vencer (30 días o menos).
                </p>
            </header>

            {/* ALERTA DE ATENCIÓN */}
            {!cargando && urgentes.length > 0 && (
                <div className="mb-6 flex items-center gap-3 text-sm bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3.5 rounded-xl shadow-sm animate-fade-in">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    <p className="font-medium">
                        {urgentes.length} {urgentes.length === 1 ? "vehículo requiere" : "vehículos requieren"} atención inmediata.
                    </p>
                </div>
            )}

            {/* TABLA PRINCIPAL */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-500">
                                <th className="px-6 py-3.5">Placa</th>
                                <th className="px-6 py-3.5">Modelo</th>
                                <th className="px-6 py-3.5 font-mono">Chofer</th>
                                <th className="px-6 py-3.5">Vence</th>
                                <th className="px-6 py-3.5">Días</th>
                                <th className="px-6 py-3.5">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cargando ? (
                                // SKELETON LOADER (Efecto de carga animado)
                                [...Array(5)].map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        {[...Array(6)].map((_, cIdx) => (
                                            <td key={cIdx} className="px-6 py-4">
                                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : datos.length === 0 ? (
                                // ESTADO VACÍO
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No hay registros de vencimientos disponibles.
                                    </td>
                                </tr>
                            ) : (
                                // FILAS DE DATOS REALES
                                datos.map(v => (
                                    <tr key={v.vehicleId} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">{v.plate}</td>
                                        <td className="px-6 py-3.5 text-slate-600">{v.model}</td>
                                        <td className="px-6 py-3.5 font-mono text-slate-500">ID: {v.driverId}</td>
                                        <td className="px-6 py-3.5 font-mono text-slate-600">
                                            {v.fechaVencimiento
                                                ? new Date(v.fechaVencimiento).toLocaleDateString("es-VE")
                                                : "—"}
                                        </td>
                                        <td className="px-6 py-3.5 font-mono font-medium">
                                            {v.diasParaVencer !== null ? (
                                                <span className={v.diasParaVencer <= 0 ? "text-red-600 font-bold" : v.diasParaVencer <= 30 ? "text-amber-600" : "text-slate-600"}>
                                                    {v.diasParaVencer}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <VencimientoPill estado={v.estado} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}