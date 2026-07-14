// src/app/(admin)/vehiculos/page.tsx
"use client";

import { useState, useEffect } from "react";

/* ============================================================
 * TIPOS — reflejan la forma exacta de los DTOs del backend.
 * Si el backend cambia un nombre de campo, se ajusta aquí.
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

interface Inspection {
    id: number;
    vehicleId: number;
    score: number;
    date: string;
    observations: string;
    expirationDate: string;
}

/* ============================================================
 *  BLOQUE DE ESTILOS — TOKENS DEL SISTEMA DE DISEÑO
 * ============================================================
 *
 * Si necesitas cambiar un color, tamaño, o el aspecto de los
 * "pills" de estado, TODO vive en este objeto — no busques
 * clases sueltas por el archivo, todo se referencia desde aquí.
 *
 * Paleta (coincide con la usada en Tarifas y el layout admin):
 *   --ink:      #12131A  → texto principal
 *   --dispatch: #0E7C86  → acento primario (acciones, activo)
 *   --alert:    #E8A23D  → estados pendientes/revisión
 *   --danger:   #C0392B  → inactivo / rechazado
 *   --border:   #E2E4E9  → líneas divisorias
 *
 * Para AGREGAR un nuevo estado de vehículo en el futuro
 * (ej. si el negocio agrega un estado nuevo), solo hay que
 * añadir una entrada nueva a `ESTADO_ESTILOS` de abajo —
 * el resto del componente ya lo va a pintar automáticamente.
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

export default function VehiculosPage() {

    /* ========================================================
     * ESTADO DEL COMPONENTE
     * ======================================================== */
    const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
    const [seleccionado, setSeleccionado] = useState<Vehicle | null>(null);
    const [historial, setHistorial] = useState<Inspection[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formRevision, setFormRevision] = useState({ score: "", observations: "" });

    /* ========================================================
     * 🔌 AQUÍ COBRAN VIDA LOS BOTONES — cada función async de
     * abajo es la que efectivamente llama al backend. El JSX
     * del final solo dispara estas funciones vía onClick/onSubmit;
     * si quieres cambiar QUÉ hace un botón, este es el lugar,
     * no el JSX.
     * ======================================================== */

    // Dispara al cargar la página, y cada vez que se necesita refrescar la lista.
    async function cargarVehiculos() {
        try {
            const res = await fetch("/api/vehicles");
            const json = await res.json();
            setVehiculos(json.data ?? []);
        } catch {
            setMensaje("No se pudo cargar la lista de vehículos.");
        }
    }

    useEffect(() => {
        cargarVehiculos();
    }, []);

    // Se dispara al hacer click en una fila de la tabla.
    // Carga el detalle Y el historial de revisiones de ese vehículo.
    async function seleccionarVehiculo(vehiculo: Vehicle) {
        setSeleccionado(vehiculo);
        setMensaje(null);
        try {
            const res = await fetch(`/api/vehicles/${vehiculo.id}/inspections`);
            const json = await res.json();
            setHistorial(json.data ?? []);
        } catch {
            setMensaje("No se pudo cargar el historial de este vehículo.");
        }
    }

    // Se dispara al enviar el formulario "Registrar revisión".
    // Este es el único punto donde se llama a RegisterVehicleInspectionUseCase.
    async function registrarRevision(e: React.FormEvent) {
        e.preventDefault();
        if (!seleccionado) return;

        setLoading(true);
        setMensaje(null);

        try {
            const res = await fetch(`/api/vehicles/${seleccionado.id}/inspections`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: Number(formRevision.score),
                    observations: formRevision.observations
                })
            });
            const json = await res.json();

            if (!res.ok) {
                setMensaje(json.error ?? "No se pudo registrar la revisión.");
            } else {
                const aprobado = Number(formRevision.score) >= 65;
                setMensaje(
                    aprobado
                        ? "Revisión registrada. El vehículo quedó apto, pendiente de selección por el chofer."
                        : "Revisión registrada. El vehículo no aprobó y quedó inactivo hasta una nueva evaluación."
                );
                setFormRevision({ score: "", observations: "" });
                await cargarVehiculos();
                await seleccionarVehiculo(seleccionado); // refresca el historial
            }
        } catch {
            setMensaje("Error de red al registrar la revisión.");
        } finally {
            setLoading(false);
        }
    }

    /* ========================================================
     * VISTA
     * ======================================================== */
    return (
        <div className="max-w-5xl">

            <header className="mb-8">
                <h1 className="font-display text-2xl tracking-tight text-[#12131A]">
                    Vehículos y revisiones
                </h1>
                <p className="text-sm text-[#12131A]/60 mt-1">
                    Consulta el estado de la flota y registra los resultados de la revisión técnica anual.
                    El registro de vehículos nuevos lo realiza el propio chofer, no el administrador.
                </p>
            </header>

            {mensaje && (
                <div className="mb-6 text-sm bg-[#0E7C86]/8 text-[#0E7C86] px-4 py-3 rounded">
                    {mensaje}
                </div>
            )}

            <div className="grid grid-cols-5 gap-6">

                {/* ---------- Columna izquierda: listado ---------- */}
                <section className="col-span-3 bg-white border border-[#E2E4E9] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#E2E4E9] text-left text-xs uppercase tracking-wide text-[#12131A]/50">
                                <th className="px-4 py-3 font-mono">id</th>
                                <th className="px-4 py-3">Placa</th>
                                <th className="px-4 py-3">Modelo</th>
                                <th className="px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map(v => (
                                <tr
                                    key={v.id}
                                    onClick={() => seleccionarVehiculo(v)}
                                    className={`cursor-pointer border-b border-[#E2E4E9] last:border-0 hover:bg-[#F4F5F7] transition-colors ${
                                        seleccionado?.id === v.id ? "bg-[#0E7C86]/5" : ""
                                    }`}
                                >
                                    <td className="px-4 py-3 font-mono text-[#12131A]/60">{v.id}</td>
                                    <td className="px-4 py-3 font-mono">{v.plate}</td>
                                    <td className="px-4 py-3">{v.model}</td>
                                    <td className="px-4 py-3"><EstadoPill estado={v.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* ---------- Columna derecha: detalle + revisión ---------- */}
                <section className="col-span-2">
                    {!seleccionado ? (
                        <div className="bg-white border border-[#E2E4E9] rounded-lg p-6 text-sm text-[#12131A]/50">
                            Selecciona un vehículo de la lista para ver su historial y registrar una revisión.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">

                            <div className="bg-white border border-[#E2E4E9] rounded-lg p-5">
                                <p className="font-mono text-sm text-[#12131A]/50 mb-1">
                                    {seleccionado.plate}
                                </p>
                                <p className="font-display text-lg">{seleccionado.model}</p>
                                <div className="mt-2"><EstadoPill estado={seleccionado.status} /></div>
                            </div>

                            <div className="bg-white border border-[#E2E4E9] rounded-lg p-5">
                                <h3 className="text-xs uppercase tracking-wide text-[#12131A]/50 mb-3">
                                    Registrar revisión técnica
                                </h3>
                                <form onSubmit={registrarRevision} className="flex flex-col gap-3">
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs text-[#12131A]/60">Calificación (0–100)</span>
                                        <input
                                            type="number" min={0} max={100}
                                            value={formRevision.score}
                                            onChange={e => setFormRevision({ ...formRevision, score: e.target.value })}
                                            required
                                            className="border border-[#E2E4E9] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs text-[#12131A]/60">Observaciones</span>
                                        <textarea
                                            value={formRevision.observations}
                                            onChange={e => setFormRevision({ ...formRevision, observations: e.target.value })}
                                            required
                                            rows={2}
                                            className="border border-[#E2E4E9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#0E7C86] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Guardando…" : "Registrar revisión"}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white border border-[#E2E4E9] rounded-lg p-5">
                                <h3 className="text-xs uppercase tracking-wide text-[#12131A]/50 mb-3">
                                    Historial de revisiones
                                </h3>
                                {historial.length === 0 ? (
                                    <p className="text-sm text-[#12131A]/40 font-mono">Sin revisiones registradas.</p>
                                ) : (
                                    <ul className="flex flex-col gap-2 text-sm font-mono">
                                        {historial.map(h => (
                                            <li key={h.id} className="flex justify-between border-b border-[#E2E4E9] pb-2 last:border-0">
                                                <span>{new Date(h.date).toLocaleDateString("es-VE")}</span>
                                                <span className={h.score >= 65 ? "text-[#0E7C86]" : "text-[#C0392B]"}>
                                                    {h.score}/100
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}