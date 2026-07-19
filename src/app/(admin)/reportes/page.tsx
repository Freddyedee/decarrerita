// src/app/(admin)/reportes/page.tsx
"use client";

import { useState } from "react";

/* ============================================================
 * TIPOS — reflejan las respuestas reales de:
 *   GET /api/reportes/ganancias?desde=&hasta=
 *   GET /api/reportes/pagado-chofer/:choferId?desde=&hasta=
 * ============================================================ */

interface GananciasResponse {
    ganancias: number;
}

interface PagadoChoferResponse {
    totalPagado: number;
}

/**
 * Explicación en español de qué hace cada consulta "por debajo".
 * Se muestra en un panel desplegable en cada reporte — pensado
 * para el punto (h) de la entrega: "pantallas de la salida de las
 * consultas así como su script".
 */
const EXPLICACION_GANANCIAS = `Fuente: GetGananciasEmpresaUseCase → WalletRepository.calcularCambioNetoSaldo

1. Se busca en "configuracion" el id de usuario de la propia empresa
   (clave "id_usuario_empresa").
2. Se busca el último movimiento de la wallet de la empresa ANTES
   de la fecha "desde" → ese saldo_posterior es el saldo inicial.
3. Se busca el último movimiento de la wallet de la empresa DENTRO
   del rango [desde, hasta] → ese saldo_posterior es el saldo final.
4. Ganancia del período = saldo final − saldo inicial.

Razón de negocio: la empresa recibe el pago completo del cliente y
luego paga al chofer su parte; la diferencia entre lo que entró y
lo que salió de su propia wallet ES la ganancia real del período.`;

const EXPLICACION_PAGADO_CHOFER = `Fuente: GetPagadoAChoferUseCase → WalletRepository.calcularCambioNetoSaldo

Mismo mecanismo que "ganancias", pero aplicado a la wallet del
chofer indicado: compara el saldo_posterior del último movimiento
antes del rango contra el del último movimiento dentro del rango.

Nota: este cálculo asume que la wallet del chofer solo se mueve
por pagos de traslado (tipo_movimiento = 'PAGO_TRASLADO'). Si en
el futuro la wallet del chofer registra otros tipos de movimiento,
este número dejaría de representar exclusivamente "lo pagado por
traslados" y habría que filtrar por tipo_movimiento explícitamente.`;

export default function ReportesPage() {

    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [choferId, setChoferId] = useState("");

    const [ganancias, setGanancias] = useState<number | null>(null);
    const [pagadoChofer, setPagadoChofer] = useState<number | null>(null);

    const [loadingGanancias, setLoadingGanancias] = useState(false);
    const [loadingPagado, setLoadingPagado] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const [verConsultaGanancias, setVerConsultaGanancias] = useState(false);
    const [verConsultaPagado, setVerConsultaPagado] = useState(false);

    /**
     * Valida que haya un rango de fechas coherente antes de
     * disparar cualquiera de las dos consultas.
     */
    function rangoValido(): boolean {
        if (!desde || !hasta) {
            setMensaje("Selecciona ambas fechas antes de consultar.");
            return false;
        }
        if (new Date(desde) > new Date(hasta)) {
            setMensaje("La fecha 'desde' no puede ser posterior a 'hasta'.");
            return false;
        }
        return true;
    }

    /* ========================================================
     * 🔌 AQUÍ COBRAN VIDA LOS BOTONES
     * ======================================================== */

    async function consultarGanancias() {
        if (!rangoValido()) return;

        setLoadingGanancias(true);
        setMensaje(null);

        try {
            const res = await fetch(`/api/reportes/ganancias?desde=${desde}&hasta=${hasta}`);
            const json = await res.json();

            if (!res.ok) {
                setMensaje(json.error ?? "No se pudo consultar las ganancias.");
                setGanancias(null);
            } else {
                setGanancias((json.data as GananciasResponse).ganancias);
            }
        } catch {
            setMensaje("Error de red al consultar ganancias.");
        } finally {
            setLoadingGanancias(false);
        }
    }

    async function consultarPagadoChofer() {
        if (!rangoValido()) return;
        if (!choferId) {
            setMensaje("Ingresa el ID del chofer.");
            return;
        }

        setLoadingPagado(true);
        setMensaje(null);

        try {
            const res = await fetch(
                `/api/reportes/pagado-chofer/${choferId}?desde=${desde}&hasta=${hasta}`
            );
            const json = await res.json();

            if (!res.ok) {
                setMensaje(json.error ?? "No se pudo consultar el pago al chofer.");
                setPagadoChofer(null);
            } else {
                setPagadoChofer((json.data as PagadoChoferResponse).totalPagado);
            }
        } catch {
            setMensaje("Error de red al consultar el pago al chofer.");
        } finally {
            setLoadingPagado(false);
        }
    }

    return (
        <div className="max-w-3xl">

            <header className="mb-8">
                <h1 className="font-display text-2xl tracking-tight text-[#12131A]">
                    Reportes
                </h1>
                <p className="text-sm text-[#12131A]/60 mt-1">
                    Ganancias de la empresa y pagos a choferes en un período de tiempo.
                </p>
            </header>

            {mensaje && (
                <div className="mb-6 text-sm bg-[#E8A23D]/10 text-[#B9791F] px-4 py-3 rounded">
                    {mensaje}
                </div>
            )}

            {/* ---------- Selector de fechas, compartido por ambos reportes ---------- */}
            <section className="bg-white border border-[#E2E4E9] rounded-lg p-5 mb-6">
                <h2 className="text-xs uppercase tracking-wide text-[#12131A]/50 mb-3">
                    Rango de fechas
                </h2>
                <div className="flex gap-4">
                    <label className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-[#12131A]/60">Desde</span>
                        <input
                            type="date"
                            value={desde}
                            onChange={e => setDesde(e.target.value)}
                            className="border border-[#E2E4E9] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
                        />
                    </label>
                    <label className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-[#12131A]/60">Hasta</span>
                        <input
                            type="date"
                            value={hasta}
                            onChange={e => setHasta(e.target.value)}
                            className="border border-[#E2E4E9] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
                        />
                    </label>
                </div>
            </section>

            {/* ---------- Ganancias de la empresa ---------- */}
            <section className="bg-white border border-[#E2E4E9] rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs uppercase tracking-wide text-[#12131A]/50">
                        Ganancias de la empresa
                    </h2>
                    <button
                        onClick={consultarGanancias}
                        disabled={loadingGanancias}
                        className="bg-[#0E7C86] text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                    >
                        {loadingGanancias ? "Consultando…" : "Consultar"}
                    </button>
                </div>
                {ganancias !== null && (
                    <p className="font-mono text-2xl text-[#0E7C86]">
                        ${ganancias.toFixed(2)}
                    </p>
                )}

                <button
                    onClick={() => setVerConsultaGanancias(v => !v)}
                    className="mt-3 text-xs text-[#12131A]/50 underline underline-offset-2 hover:text-[#12131A]/80"
                >
                    {verConsultaGanancias ? "Ocultar detalle de la consulta" : "Ver detalle de la consulta"}
                </button>
                {verConsultaGanancias && (
                    <pre className="mt-2 text-xs bg-[#12131A]/[0.03] border border-[#E2E4E9] rounded p-3 whitespace-pre-wrap text-[#12131A]/70">
                        {EXPLICACION_GANANCIAS}
                    </pre>
                )}
            </section>

            {/* ---------- Pagado a un chofer específico ---------- */}
            <section className="bg-white border border-[#E2E4E9] rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs uppercase tracking-wide text-[#12131A]/50">
                        Pagado a un chofer específico
                    </h2>
                </div>
                <div className="flex items-end gap-3">
                    <label className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-[#12131A]/60">ID del chofer</span>
                        <input
                            type="number"
                            value={choferId}
                            onChange={e => setChoferId(e.target.value)}
                            placeholder="ej. 1"
                            className="border border-[#E2E4E9] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40"
                        />
                    </label>
                    <button
                        onClick={consultarPagadoChofer}
                        disabled={loadingPagado}
                        className="bg-[#0E7C86] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                    >
                        {loadingPagado ? "Consultando…" : "Consultar"}
                    </button>
                </div>
                {pagadoChofer !== null && (
                    <p className="font-mono text-2xl text-[#0E7C86] mt-3">
                        ${pagadoChofer.toFixed(2)}
                    </p>
                )}

                <button
                    onClick={() => setVerConsultaPagado(v => !v)}
                    className="mt-3 text-xs text-[#12131A]/50 underline underline-offset-2 hover:text-[#12131A]/80"
                >
                    {verConsultaPagado ? "Ocultar detalle de la consulta" : "Ver detalle de la consulta"}
                </button>
                {verConsultaPagado && (
                    <pre className="mt-2 text-xs bg-[#12131A]/[0.03] border border-[#E2E4E9] rounded p-3 whitespace-pre-wrap text-[#12131A]/70">
                        {EXPLICACION_PAGADO_CHOFER}
                    </pre>
                )}
            </section>
        </div>
    );
}