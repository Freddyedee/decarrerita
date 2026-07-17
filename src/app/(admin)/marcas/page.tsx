// src/app/(admin)/marcas/page.tsx
"use client";

import { useState, useEffect } from "react";

/* ============================================================
 * TIPOS — reflejan el DTO real de GetAllMarcasUseCase /
 * CreateMarcaUseCase. Si el backend cambia un nombre de campo,
 * se ajusta aquí primero.
 * ============================================================ */

interface Marca {
    id: number;
    nombre: string;
    descripcion: string | null;
}

export default function MarcasPage() {

    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ nombre: "", descripcion: "" });

    /* ========================================================
     * 🔌 AQUÍ COBRAN VIDA LOS BOTONES
     * ========================================================
     * Único punto de conexión con el backend en esta pantalla.
     * Si quieres cambiar QUÉ hace un botón, este es el lugar.
     * ======================================================== */

    async function cargarMarcas() {
        try {
            const res = await fetch("/api/marcas");
            const json = await res.json();
            setMarcas(json.data ?? []);
        } catch {
            setMensaje("No se pudo cargar el listado de marcas.");
        }
    }

    useEffect(() => {
        cargarMarcas();
    }, []);

    async function crearMarca(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMensaje(null);

        try {
            const res = await fetch("/api/marcas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: form.nombre,
                    descripcion: form.descripcion || undefined
                })
            });
            const json = await res.json();

            if (!res.ok) {
                // El backend ya valida duplicados (CreateMarcaUseCase),
                // por eso este mensaje puede decir "ya existe" sin que
                // esta pantalla tenga que revisarlo por su cuenta.
                setMensaje(json.error ?? "No se pudo crear la marca.");
            } else {
                setMensaje(`Marca "${json.data.nombre}" creada correctamente.`);
                setForm({ nombre: "", descripcion: "" });
                await cargarMarcas();
            }
        } catch {
            setMensaje("Error de red al crear la marca.");
        } finally {
            setLoading(false);
        }
    }

    /* ========================================================
     * VISTA
     * ======================================================== */
    return (
        <div className="max-w-3xl">

            <header className="mb-8">
                <h1 className="font-display text-2xl tracking-tight text-[#12131A]">
                    Marcas
                </h1>
                <p className="text-sm text-[#12131A]/60 mt-1">
                    Catálogo de marcas de vehículos. Evita inconsistencias de nombre
                    (ej. {"\"Ford\""} vs {"\"ford\""}) al registrar un vehículo nuevo.
                </p>
            </header>

            {mensaje && (
                <div className="mb-6 text-sm bg-[#0E7C86]/8 text-[#0E7C86] px-4 py-3 rounded">
                    {mensaje}
                </div>
            )}

            {/* ---------- Formulario ---------- */}
            <form
                onSubmit={crearMarca}
                className="flex items-end gap-3 bg-white border border-[#E2E4E9] rounded-lg p-5 mb-6"
            >
                <label className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-[#12131A]/60">Nombre</span>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        required
                        className="border border-[#E2E4E9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
                    />
                </label>
                <label className="flex flex-col gap-1 flex-[2]">
                    <span className="text-xs text-[#12131A]/60">Descripción (opcional)</span>
                    <input
                        type="text"
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                        className="border border-[#E2E4E9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
                    />
                </label>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0E7C86] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                >
                    {loading ? "Guardando…" : "Agregar marca"}
                </button>
            </form>

            {/* ---------- Listado ---------- */}
            <section className="bg-white border border-[#E2E4E9] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#E2E4E9] text-left text-xs uppercase tracking-wide text-[#12131A]/50">
                            <th className="px-4 py-3 font-mono">id</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.map(m => (
                            <tr key={m.id} className="border-b border-[#E2E4E9] last:border-0">
                                <td className="px-4 py-3 font-mono text-[#12131A]/60">{m.id}</td>
                                <td className="px-4 py-3">{m.nombre}</td>
                                <td className="px-4 py-3 text-[#12131A]/60">{m.descripcion ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}