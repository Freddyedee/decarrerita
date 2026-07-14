// src/app/(admin)/tarifas/page.tsx
"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Tarifa {
    id: number;
    precioKm: number;
    tarifaBase: number;
    tarifaCancelacion: number;
    porcentajeComision: number;
    fechaInicioVigencia: string;
    fechaFinVigencia: string | null;
}

export default function TarifasPage() {

    const [tarifaVigente, setTarifaVigente] = useState<Tarifa | null>(null);
    const [cargando, setCargando] = useState(true); // controla el skeleton de la tarjeta "Tarifa vigente"
    const [loading, setLoading] = useState(false);   // controla el estado de envío del formulario
    //const [mensaje, setMensaje] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

    const [form, setForm] = useState({
        precioKm: "",
        tarifaBase: "",
        tarifaCancelacion: "",
        porcentajeComision: ""
        
    });

    // ⚠️ Lógica sin cambios: misma llamada, mismo endpoint, mismo manejo de estado.
    async function cargarTarifaVigente() {
        setCargando(true);
        try {
            const res = await fetch("/api/tarifas");
            const json = await res.json();
            setTarifaVigente(json.data ?? null);
        } catch {
            setMensaje({tipo: "error", texto: "No se pudo cargar la tarifa vigente."});
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarTarifaVigente();
    }, []);

    // ⚠️ Lógica sin cambios: mismo payload, mismo endpoint, mismo flujo post-creación.
    async function crearTarifa(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMensaje(null);

        try {
            const res = await fetch("/api/tarifas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    precioKm: Number(form.precioKm),
                    tarifaBase: Number(form.tarifaBase),
                    tarifaCancelacion: Number(form.tarifaCancelacion),
                    porcentajeComision: Number(form.porcentajeComision)
                })
            });
            const json = await res.json();

            if (!res.ok) {

                setMensaje({ tipo: "error", texto: json.error ?? "No se pudo crear la tarifa." });
            
            } else {
            
                setMensaje({ tipo: "success", texto: "Nueva tarifa vigente desde ahora. La anterior quedó cerrada automáticamente." });
                setForm({ precioKm: "", tarifaBase: "", tarifaCancelacion: "", porcentajeComision: "" });
                await cargarTarifaVigente();
            
            }
        } catch {
            setMensaje({tipo: "error", texto: "error de red al cargar la tarifa. "});

        } finally {
            setLoading(false);
        }
    }

    return (
        // Mismo contenedor/spacing que la pantalla de Vencimientos: max-w-4xl + padding consistente.
        <div className="max-w-4xl mx-auto px-4 py-6">

            {/* ============================================================
             * ENCABEZADO
             * Mismo patrón tipográfico que Vencimientos: título slate-900,
             * subtítulo slate-500 con leading-relaxed.
             * ============================================================ */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Tarifas
                </h1>
                <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                    Solo existe una tarifa vigente a la vez. Crear una nueva cierra la
                    anterior automáticamente.
                </p>
            </header>

            {/* ============================================================
             * MENSAJE DE ESTADO (éxito / error del formulario)
             * TODO(alertas futuras): este es el bloque natural para engancharse
             * cuando se agregue el sistema de alertas — hoy solo es un texto
             * plano al pie del formulario, ver sección FORMULARIO más abajo.
             * ============================================================ */}

            {/* ============================================================
             * TARJETA: TARIFA VIGENTE
             * Mismo look de "card" que las secciones de Vencimientos:
             * bg-white + border-slate-200 + rounded-xl + shadow-sm.
             * ============================================================ */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                        Tarifa vigente
                    </h2>
                    {tarifaVigente && (
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border bg-teal-500/10 text-teal-700 border-teal-500/20">
                            id_tarifa: {tarifaVigente.id}
                        </span>
                    )}
                </div>

                <div className="px-6 py-5">
                    {cargando ? (
                        // SKELETON LOADER — mismo patrón animate-pulse que la tabla de Vencimientos
                        <div className="grid grid-cols-2 gap-y-3 gap-x-8 animate-pulse">
                            {[...Array(4)].map((_, idx) => (
                                <div key={idx} className="flex justify-between border-b border-slate-100 pb-2">
                                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                                </div>
                            ))}
                        </div>
                    ) : tarifaVigente ? (
                        <dl className="grid grid-cols-2 gap-y-3 gap-x-8 font-mono text-sm">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-slate-500">Precio / km</dt>
                                <dd className="text-slate-900">${tarifaVigente.precioKm.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-slate-500">Tarifa base</dt>
                                <dd className="text-slate-900">${tarifaVigente.tarifaBase.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-slate-500">Penalización cancelación</dt>
                                <dd className="text-slate-900">${tarifaVigente.tarifaCancelacion.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-slate-500">Comisión empresa</dt>
                                <dd className="text-slate-900">{tarifaVigente.porcentajeComision}%</dd>
                            </div>
                            <div className="col-span-2 flex justify-between pt-1">
                                <dt className="text-slate-500">Vigente desde</dt>
                                <dd className="text-slate-900">
                                    {new Date(tarifaVigente.fechaInicioVigencia).toLocaleString("es-VE")}
                                </dd>
                            </div>
                        </dl>
                    ) : (
                        // ESTADO VACÍO — mismo tono que la tabla vacía de Vencimientos
                        <p className="text-center text-slate-400 font-medium py-6">
                            Sin tarifa vigente configurada.
                        </p>
                    )}
                </div>
            </section>

            {/* ============================================================
             * FORMULARIO: REGISTRAR NUEVA TARIFA
             * ============================================================ */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200">
                    <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                        Registrar nueva tarifa
                    </h2>
                </div>

                <div className="px-6 py-5">
                    <form onSubmit={crearTarifa} className="grid grid-cols-2 gap-4">
                        <Campo
                            label="Precio por km"
                            value={form.precioKm}
                            onChange={v => setForm({ ...form, precioKm: v })}
                        />
                        <Campo
                            label="Tarifa base"
                            value={form.tarifaBase}
                            onChange={v => setForm({ ...form, tarifaBase: v })}
                        />
                        <Campo
                            label="Penalización por cancelación"
                            value={form.tarifaCancelacion}
                            onChange={v => setForm({ ...form, tarifaCancelacion: v })}
                        />
                        <Campo
                            label="Comisión de la empresa (%)"
                            value={form.porcentajeComision}
                            onChange={v => setForm({ ...form, porcentajeComision: v })}
                        />

                        <div className="col-span-2 flex items-center gap-4 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Guardando…" : "Guardar nueva tarifa"}
                            </button>

                            {/* Mensaje de éxito/error del formulario.
                                TODO(alertas futuras): candidato a reemplazar por el
                                componente de alerta compartido (banner tipo el de
                                Vencimientos: bg-amber-50/border-amber-200) cuando
                                se centralice el sistema de notificaciones. */}
                            {mensaje && (
                                <Alert variant={mensaje.tipo === "error" ? "destructive" : "default"} className="mt-2">
                                {mensaje.tipo === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                <AlertTitle>{mensaje.tipo === "error" ? "Error" : "Listo"}</AlertTitle>
                                <AlertDescription>{mensaje.texto}</AlertDescription>
                            </Alert>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

/**
 * Campo de formulario reutilizable. Vive aquí por ahora porque
 * solo esta pantalla lo usa; si otras pantallas del admin lo
 * necesitan, moverlo a un componente compartido en
 * src/shared/ui/Campo.tsx.
 */
function Campo({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">{label}</span>
            <input
                type="number"
                step="0.01"
                value={value}
                onChange={e => onChange(e.target.value)}
                required
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
        </label>
    );
}