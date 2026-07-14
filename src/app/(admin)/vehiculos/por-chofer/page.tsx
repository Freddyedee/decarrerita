// src/app/(admin)/vehiculos/por-chofer/page.tsx
"use client";

import { useState } from "react";

/* ============================================================
 * TIPOS — igual que en /vehiculos, reflejan el DTO real del
 * backend. Si cambia allá, se ajusta aquí también.
 * ============================================================ */

interface Vehicle {
    id: number;
    brandId: number;
    driverId: number;
    plate: string;
    model: string;
    color: string;
    year: number;
    passengerCapacity: number;
    status: "activo" | "inactivo" | "en_revision" | "mantenimiento";
    createdAt: string;
}

/* ============================================================
 * 🎨 BLOQUE DE ESTILOS
 * ============================================================
 * Reutiliza los mismos tokens de color que /vehiculos. Si algún
 * día quieres que esta pantalla luzca distinta a esa, este es
 * el único lugar que necesitas tocar — no hay clases de color
 * repetidas en el JSX de más abajo.
 * ============================================================ */

const ESTADO_ESTILOS: Record<Vehicle["status"], { label: string; className: string }> = {
    activo:         { label: "Activo",        className: "bg-[#0E7C86]/10 text-[#0E7C86]" },
    en_revision:    { label: "En revisión",   className: "bg-[#E8A23D]/15 text-[#B9791F]" },
    inactivo:       { label: "Inactivo",      className: "bg-[#12131A]/8 text-[#12131A]/60" },
    mantenimiento:  { label: "Mantenimiento", className: "bg-[#4C6EF5]/10 text-[#4C6EF5]" },
};

function EstadoPill({ estado }: { estado: Vehicle["status"] }) {
    const config = ESTADO_ESTILOS[estado];
    return (
        <span className={`text-xs font-mono px-2 py-1 rounded ${config.className}`}>
            {config.label}
        </span>
    );
}

export default function VehiculosPorChoferPage() {

    const [choferId, setChoferId] = useState("");
    const [vehiculos, setVehiculos] = useState<Vehicle[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [buscado, setBuscado] = useState(false);

    /* ========================================================
     * 🔌 AQUÍ COBRA VIDA EL BOTÓN "BUSCAR"
     * ========================================================
     * Este es el único punto de conexión con el backend en
     * toda esta pantalla — consume GetVehiclesByDriverUseCase
     * vía GET /api/vehicles/driver/:driverId.
     * ======================================================== */
    async function buscarVehiculosDelChofer(e: React.FormEvent) {
        e.preventDefault();

        if (!choferId) return;

        setLoading(true);
        setMensaje(null);
        setBuscado(true);

        try {
            const res = await fetch(`/api/vehicles/driver/${choferId}`);
            const json = await res.json();

            if (!res.ok) {
                setVehiculos([]);
                setMensaje(json.error ?? "No se encontraron vehículos para este chofer.");
            } else {
                setVehiculos(json.data ?? []);
            }
        } catch {
            setMensaje("Error de red al consultar los vehículos.");
            setVehiculos([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl">

            <header className="mb-8">
                <h1 className="font-display text-2xl tracking-tight text-[#12131A]">
                    Vehículos por chofer
                </h1>
                <p className="text-sm text-[#12131A]/60 mt-1">
                    Un chofer puede tener varios vehículos registrados. Consulta cuáles
                    le pertenecen y en qué estado se encuentra cada uno.
                </p>
            </header>

            {/* ---------- Formulario de búsqueda ---------- */}
            <form
                onSubmit={buscarVehiculosDelChofer}
                className="flex items-end gap-3 bg-white border border-[#E2E4E9] rounded-lg p-5 mb-6"
            >
                <label className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-[#12131A]/60">ID del chofer</span>
                    <input
                        type="number"
                        value={choferId}
                        onChange={e => setChoferId(e.target.value)}
                        placeholder="ej. 1"
                        required
                        className="border border-[#E2E4E9] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
                    />
                </label>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0E7C86] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                >
                    {loading ? "Buscando…" : "Buscar"}
                </button>
            </form>

            {mensaje && (
                <p className="text-sm text-[#12131A]/60 mb-4">{mensaje}</p>
            )}

            {/* ---------- Resultado ---------- */}
            {buscado && vehiculos && vehiculos.length > 0 && (
                <section className="bg-white border border-[#E2E4E9] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#E2E4E9] text-left text-xs uppercase tracking-wide text-[#12131A]/50">
                                <th className="px-4 py-3 font-mono">id</th>
                                <th className="px-4 py-3">Placa</th>
                                <th className="px-4 py-3">Modelo</th>
                                <th className="px-4 py-3">Color</th>
                                <th className="px-4 py-3">Año</th>
                                <th className="px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map(v => (
                                <tr key={v.id} className="border-b border-[#E2E4E9] last:border-0">
                                    <td className="px-4 py-3 font-mono text-[#12131A]/60">{v.id}</td>
                                    <td className="px-4 py-3 font-mono">{v.plate}</td>
                                    <td className="px-4 py-3">{v.model}</td>
                                    <td className="px-4 py-3">{v.color}</td>
                                    <td className="px-4 py-3 font-mono">{v.year}</td>
                                    <td className="px-4 py-3"><EstadoPill estado={v.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {buscado && vehiculos && vehiculos.length === 0 && !mensaje && (
                <p className="text-sm text-[#12131A]/40 font-mono">
                    Este chofer no tiene vehículos registrados.
                </p>
            )}
        </div>
    );
}