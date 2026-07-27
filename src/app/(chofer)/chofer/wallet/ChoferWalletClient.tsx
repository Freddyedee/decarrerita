"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, ArrowUpRight, History, Clock, CheckCircle2, 
  XCircle, AlertCircle, Building2, CreditCard, User, Loader2 
} from "lucide-react";

interface Movimiento {
  id_movimiento: number;
  tipo_movimiento: string;
  monto: number;
  saldo_anterior: number;
  saldo_posterior: number;
  descripcion: string;
  fecha_movimiento: string;
}

interface SolicitudRetiro {
  id_retiro: number;
  monto: number;
  numero_cuenta: string;
  titular_cuenta: string;
  estado: string;
  fecha_solicitud: string;
  banco?: { nombre: string };
}

interface WalletData {
  id_wallet: number;
  saldo_disponible: number;
  saldo_congelado: number;
  moneda: string;
  movimiento_wallet: Movimiento[];
  solicitud_retiro: SolicitudRetiro[];
}

// Reemplaza la interfaz Banco por esta:
interface Banco {
  id: number;
  nombre: string;
}

export default function ChoferWalletClient({ choferId }: { choferId: number }) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [bancos, setBancos] = useState<Banco[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estado del Formulario de Retiro Dinámico
  const [montoRetiro, setMontoRetiro] = useState("");
  const [bancoId, setBancoId] = useState<number | "">("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [titularCuenta, setTitularCuenta] = useState("");

  // Cargar datos de la Wallet y lista de Bancos
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // 1. Consultar datos de la wallet del chofer en sesión
      const resWallet = await fetch(`/api/drivers/${choferId}/wallet?t=${Date.now()}`, { cache: "no-store" });
      if (resWallet.ok) {
        const { data } = await resWallet.json();
        setWallet(data);
      }

      // 2. Consultar catálogo de bancos de la base de datos
      const resBancos = await fetch(`/api/bancos`, { cache: "no-store" });
      if (resBancos.ok) {
        const resJson = await resBancos.json();
        const listaBancos = Array.isArray(resJson.data) ? resJson.data : Array.isArray(resJson) ? resJson : [];
        setBancos(listaBancos);
        if (listaBancos.length > 0) {
          setBancoId(listaBancos[0].id_banco);
        }
      }
    } catch (error) {
      console.error("Error cargando wallet o bancos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (choferId) {
      fetchWalletData();
    }
  }, [choferId]);

  // UX: Rellenar el 100% del saldo disponible
  const handleRetirarTodo = () => {
    if (wallet) {
      setMontoRetiro(Number(wallet.saldo_disponible).toFixed(2));
    }
  };

  const handleSolicitarRetiro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    if (!bancoId || typeof bancoId !== "number" || bancoId <= 0) {
      setErrorMsg("Debe seleccionar un banco de destino válido.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/drivers/${choferId}/retiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: Number(montoRetiro),
          bancoId: Number(bancoId), // <-- ¡DINÁMICO SEGÚN LA SELECCIÓN DEL CHOFER!
          numeroCuenta: numeroCuenta.trim(),
          titularCuenta: titularCuenta.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error al solicitar el retiro");
      }

      setSuccessMsg("¡Retiro solicitado exitosamente! Está en revisión por tesorería.");
      setShowModal(false);
      
      // Reiniciar formulario
      setMontoRetiro("");
      setNumeroCuenta("");
      setTitularCuenta("");
      if (bancos.length > 0) setBancoId(bancos[0].id);

      // Recargar datos
      await fetchWalletData();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando tu billetera digital...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mi Wallet</h1>
          <p className="text-sm text-slate-500">Gestiona tus ganancias y retiros bancarios</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!wallet || Number(wallet.saldo_disponible) <= 0}
          className="bg-[#0E7C86] hover:bg-[#0b626a] disabled:bg-slate-300 text-white font-bold px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 transition-all"
        >
          <ArrowUpRight className="w-5 h-5" />
          Solicitar Retiro
        </button>
      </div>

      {/* Alerta de Éxito */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {/* Tarjetas de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#0E7C86] to-[#095259] text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
          <Wallet className="w-32 h-32 absolute -right-6 -bottom-6 text-white/10 pointer-events-none" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-100">Saldo Disponible</span>
          <div className="text-4xl font-black font-mono mt-2 mb-4">
            ${Number(wallet?.saldo_disponible || 0).toFixed(2)}
          </div>
          <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
            Listo para retirar
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saldo en Retención (Congelado)</span>
            <div className="text-3xl font-black font-mono text-slate-800 mt-2">
              ${Number(wallet?.saldo_congelado || 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-xl mt-4 border border-amber-100">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Fondos en proceso de transferencia bancaria por administración.</span>
          </div>
        </div>
      </div>

      {/* Historial de Solicitudes de Retiro */}
      {wallet?.solicitud_retiro && wallet.solicitud_retiro.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0E7C86]" />
            <h2 className="font-bold text-slate-800">Historial de Retiros</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {wallet.solicitud_retiro.map((sol) => (
              <div key={sol.id_retiro} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span>Retiro #{sol.id_retiro}</span>
                    <span className="text-xs font-normal text-slate-400">({sol.banco?.nombre || "Banco"})</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Cuenta: {sol.numero_cuenta} • {sol.titular_cuenta}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black font-mono text-slate-900">${Number(sol.monto).toFixed(2)}</div>
                  <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-1 ${
                    sol.estado === "APROBADA" || sol.estado === "APROBADO" ? "bg-emerald-100 text-emerald-800" :
                    sol.estado === "RECHAZADA" || sol.estado === "RECHAZADO" ? "bg-rose-100 text-rose-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {sol.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Movimientos */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <History className="w-5 h-5 text-[#0E7C86]" />
          <h2 className="font-bold text-slate-800">Últimos Movimientos</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {wallet?.movimiento_wallet && wallet.movimiento_wallet.length > 0 ? (
            wallet.movimiento_wallet.map((mov) => (
              <div key={mov.id_movimiento} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {mov.tipo_movimiento}
                  </span>
                  <p className="text-sm font-medium text-slate-800 mt-1">{mov.descripcion}</p>
                  <span className="text-[11px] text-slate-400">
                    {new Date(mov.fecha_movimiento).toLocaleString("es-VE")}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <div className={`font-black text-base ${
                    mov.tipo_movimiento === "RETIRO" ? "text-rose-600" : "text-emerald-600"
                  }`}>
                    {mov.tipo_movimiento === "RETIRO" ? "-" : "+"}${Number(mov.monto).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Saldo: ${Number(mov.saldo_posterior).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No tienes movimientos registrados todavía.
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE RETIRO CON DROPDOWN DE BANCOS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0E7C86]" /> Solicitar Retiro Bancario
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSolicitarRetiro} className="space-y-4">
              {/* MONTO */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Monto a Retirar ($)</label>
                  <button
                    type="button"
                    onClick={handleRetirarTodo}
                    className="text-xs font-extrabold text-[#0E7C86] hover:underline bg-teal-50 px-2 py-0.5 rounded-md"
                  >
                    ⚡ Retirar Todo (${Number(wallet?.saldo_disponible || 0).toFixed(2)})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    max={Number(wallet?.saldo_disponible || 0)}
                    required
                    value={montoRetiro}
                    onChange={(e) => setMontoRetiro(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
              </div>

              {/* SELECTOR DE BANCO DE DESTINO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Banco de Destino</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={bancoId}
                    onChange={(e) => setBancoId(Number(e.target.value))}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  >
                    {bancos.map((b) => (
                      <option key={`banco-${b.id}`} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NÚMERO DE CUENTA / PAGO MÓVIL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Cuenta / Pago Móvil</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    placeholder="Ej: 0134-0000-00-0000000000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
              </div>

              {/* TITULAR DE LA CUENTA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Titular de la Cuenta / C.I.</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={titularCuenta}
                    onChange={(e) => setTitularCuenta(e.target.value)}
                    placeholder="Ej: Nombre Apellido - V-12345678"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !montoRetiro || Number(montoRetiro) <= 0 || !bancoId}
                  className="flex-1 bg-[#0E7C86] hover:bg-[#0b626a] disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-sm flex justify-center items-center gap-2 transition-all text-sm"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Retiro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}