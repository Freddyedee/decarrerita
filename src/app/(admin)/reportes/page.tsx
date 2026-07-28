"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, Calendar, Loader2, AlertCircle, 
  HelpCircle, User, Building2, CreditCard
} from "lucide-react";

export default function ReportesPage() {
  const hoy = new Date().toISOString().split("T")[0];
  const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(hoy);
  const [choferId, setChoferId] = useState("");

  // ESTADOS DE COMISIÓN DINÁMICA (Inician en 15 y 85 pero se auto-actualizan desde BD)
  const [comisionEmpresa, setComisionEmpresa] = useState<number>(15);
  const [comisionChofer, setComisionChofer] = useState<number>(85);

  // Estados Reporte Ganancias
  const [ganancias, setGanancias] = useState<number | null>(null);
  const [viajesEmpresa, setViajesEmpresa] = useState<number>(0);
  const [volumenEmpresa, setVolumenEmpresa] = useState<number>(0);
  const [loadingGanancias, setLoadingGanancias] = useState(false);

  // Estados Reporte Chofer
  const [pagadoChofer, setPagadoChofer] = useState<number | null>(null);
  const [nombreChofer, setNombreChofer] = useState<string>("");
  const [historialRetiros, setHistorialRetiros] = useState<any[]>([]);
  const [viajesChofer, setViajesChofer] = useState<number>(0);
  const [volumenChofer, setVolumenChofer] = useState<number>(0);
  const [loadingPagado, setLoadingPagado] = useState(false);

  const [verExpGanancias, setVerExpGanancias] = useState(false);
  const [verExpPagado, setVerExpPagado] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Funciones generadoras de texto dinámico para la justificación SQL
  const obtenerExplicacionGanancias = () => `CÁLCULO DE GANANCIAS DE LA EMPRESA (RN-015):
• En el modelo de negocio de Decarrerita, la empresa retiene el ${comisionEmpresa}% por concepto de comisión operativa según la tabla 'tarifa' activa.
• La consulta SQL/Prisma busca en la wallet de la empresa o suma (SUM) el campo 'costo_estimado' de los traslados finalizados dentro del rango [desde, hasta].
• Fórmula aplicada: Ganancia Neta = SUM(costo_estimado) * ${(comisionEmpresa / 100).toFixed(2)}`;

  const obtenerExplicacionPagado = () => `CÁLCULO DE PAGOS Y RETIROS A CHOFER (RN-085):
• El chofer percibe el ${comisionChofer}% del costo total del traslado prestado (proporción complementaria a la tarifa de empresa).
• El sistema consulta la tabla 'solicitud_retiro' filtrando por la wallet del chofer y estados aprobados en el periodo seleccionado.
• Si no ha solicitado retiros aún, muestra el saldo líquido acumulado: SUM(costo_estimado) * ${(comisionChofer / 100).toFixed(2)}.`;

  // Consultar Ganancias de la Empresa
  const consultarGanancias = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!desde || !hasta) {
      setErrorMsg("Por favor selecciona un rango de fechas válido.");
      return;
    }
    setErrorMsg("");
    setLoadingGanancias(true);
    try {
      const res = await fetch(`/api/reportes/ganancias?desde=${desde}&hasta=${hasta}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error consultando ganancias");

      const valGanancias = data.ganancias !== undefined ? data.ganancias : (data.data?.ganancias ?? 0);
      setGanancias(Number(valGanancias));
      setViajesEmpresa(data.data?.totalViajes || 0);
      setVolumenEmpresa(data.data?.volumenTotal || 0);

      // ✨ ACTUALIZAMOS COMISIÓN DINÁMICAMENTE DESDE LA BD
      if (data.comisionEmpresa) setComisionEmpresa(Number(data.comisionEmpresa));
      if (data.comisionChofer) setComisionChofer(Number(data.comisionChofer));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "No se pudo obtener el reporte financiero de la empresa.");
    } finally {
      setLoadingGanancias(false);
    }
  };

  // Consultar Pagos a Chofer Específico
  const consultarPagadoChofer = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (!choferId || isNaN(Number(choferId))) {
      setErrorMsg("Por favor ingresa el ID numérico del chofer a consultar.");
      return;
    }
    if (!desde || !hasta) {
      setErrorMsg("Por favor selecciona un rango de fechas válido.");
      return;
    }
    setErrorMsg("");
    setLoadingPagado(true);
    setPagadoChofer(null);
    setHistorialRetiros([]);
    setNombreChofer("");

    try {
      const idLimpio = encodeURIComponent(choferId.trim());
      const res = await fetch(`/api/reportes/pagado-chofer/${idLimpio}?desde=${desde}&hasta=${hasta}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error consultando pagos del chofer");

      setPagadoChofer(Number(data.totalPagado || 0));
      setNombreChofer(data.chofer || `Chofer #${choferId}`);
      setHistorialRetiros(data.historialRetiros || []);
      setViajesChofer(data.data?.totalViajes || 0);
      setVolumenChofer(data.data?.volumenBruto || 0);

      // ✨ ACTUALIZAMOS COMISIÓN DINÁMICAMENTE DESDE LA BD
      if (data.comisionEmpresa) setComisionEmpresa(Number(data.comisionEmpresa));
      if (data.comisionChofer) setComisionChofer(Number(data.comisionChofer));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "No se pudo obtener el historial financiero del chofer.");
    } finally {
      setLoadingPagado(false);
    }
  };

  useEffect(() => {
    consultarGanancias();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Cabecera */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-[#0E7C86]" />
          <span>Reportes Financieros y Liquidaciones</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Auditoría de comisiones operativas de la empresa ({comisionEmpresa}%) y liquidación de pagos a choferes ({comisionChofer}%) según la entidad Tarifa activa.
        </p>
      </div>

      {/* Alerta de Errores */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* BARRA DE RANGO DE FECHAS GLOBAL */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Calendar className="w-5 h-5 text-[#0E7C86]" />
          <span>Periodo de Auditoría:</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs font-bold">
            <span className="text-slate-400">Desde:</span>
            <input 
              type="date" 
              value={desde} 
              onChange={(e) => setDesde(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer font-extrabold" 
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs font-bold">
            <span className="text-slate-400">Hasta:</span>
            <input 
              type="date" 
              value={hasta} 
              onChange={(e) => setHasta(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer font-extrabold" 
            />
          </div>
        </div>
      </div>

      {/* GRID DE DOS COLUMNAS: REPORTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* REPORTE 1: GANANCIAS DE LA EMPRESA */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-teal-100 text-[#0E7C86] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1 transition-all">
                <Building2 className="w-3.5 h-3.5" /> Comisión {comisionEmpresa}%
              </span>
              <button 
                type="button"
                onClick={() => setVerExpGanancias(!verExpGanancias)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold underline"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Ver script SQL / Lógica
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900">Recaudación Neta de la Empresa</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calcula los ingresos propios de Decarrerita generados por servicios de transporte finalizados en el periodo seleccionado.
            </p>
          </div>

          {verExpGanancias && (
            <div className="bg-slate-900 text-teal-300 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap border border-slate-800 shadow-inner animate-in fade-in">
              {obtenerExplicacionGanancias()}
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Ganancia Efectiva en Periodo</span>
            {ganancias !== null ? (
              <div className="text-4xl font-black text-emerald-600 font-mono tracking-tight animate-in zoom-in-95 duration-200">
                ${ganancias.toFixed(2)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-slate-300 py-2">--.--</div>
            )}
            {viajesEmpresa > 0 && (
              <div className="text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-200/60 flex justify-center gap-4">
                <span>Viajes auditados: <strong>{viajesEmpresa}</strong></span>
                <span>Volumen Bruto: <strong>${volumenEmpresa.toFixed(2)}</strong></span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => consultarGanancias(e)}
            disabled={loadingGanancias}
            className="w-full bg-[#0E7C86] hover:bg-[#095259] disabled:bg-slate-300 text-white font-extrabold py-3.5 rounded-2xl shadow-md flex justify-center items-center gap-2 text-sm transition-all"
          >
            {loadingGanancias ? <><Loader2 className="w-4 h-4 animate-spin" /> Auditando viajes...</> : "Actualizar Ganancias"}
          </button>
        </div>

        {/* REPORTE 2: LIQUIDACIÓN A CHOFER */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1 transition-all">
                <User className="w-3.5 h-3.5" /> Liquidación {comisionChofer}%
              </span>
              <button 
                type="button"
                onClick={() => setVerExpPagado(!verExpPagado)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold underline"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Ver script SQL / Lógica
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900">Pagos Cancelados a Chofer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consulta el monto neto liquidado o transferido a un chofer específico y visualiza su historial de retiros bancarios.
            </p>
          </div>

          {verExpPagado && (
            <div className="bg-slate-900 text-blue-300 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap border border-slate-800 shadow-inner animate-in fade-in">
              {obtenerExplicacionPagado()}
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700 block">ID Numérico del Chofer (Usuario ID):</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Ej: 3 o 15"
                value={choferId}
                onChange={(e) => setChoferId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-3">
            {nombreChofer && (
              <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-3 py-1 rounded-full inline-block animate-in fade-in">
                👤 {nombreChofer}
              </span>
            )}
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Liquidado / Cancelado</span>
            {pagadoChofer !== null ? (
              <div className="text-4xl font-black text-blue-600 font-mono tracking-tight animate-in zoom-in-95 duration-200">
                ${pagadoChofer.toFixed(2)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-slate-300 py-2">--.--</div>
            )}

            {historialRetiros.length > 0 ? (
              <div className="mt-4 pt-4 border-t border-slate-200 text-left space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Desglose de Retiros Procesados ({historialRetiros.length}):</span>
                </span>
                <div className="overflow-x-auto max-h-52 border border-slate-200 rounded-xl bg-white shadow-inner">
                  <table className="w-full text-[11px] font-mono">
                    <thead className="bg-slate-100 text-slate-600 uppercase border-b sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Fecha</th>
                        <th className="p-2 text-left">Referencia / Cta</th>
                        <th className="p-2 text-left">Banco</th>
                        <th className="p-2 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historialRetiros.map((r, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-2 text-slate-600 whitespace-nowrap">
                            {new Date(r.fechaSolicitud).toLocaleDateString("es-VE")}
                          </td>
                          <td className="p-2 font-bold text-slate-800 whitespace-nowrap">{r.referencia}</td>
                          <td className="p-2 text-slate-500 whitespace-nowrap">{r.banco}</td>
                          <td className="p-2 text-right font-black text-emerald-600 whitespace-nowrap">
                            +${r.monto.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : pagadoChofer !== null && (
              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-200/60 leading-relaxed">
                ℹ️ No se registraron retiros bancarios en este periodo. El monto mostrado corresponde al {comisionChofer}% líquido acumulado por sus viajes completados.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => consultarPagadoChofer(e)}
            disabled={loadingPagado || !choferId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold py-3.5 rounded-2xl shadow-md flex justify-center items-center gap-2 text-sm transition-all"
          >
            {loadingPagado ? <><Loader2 className="w-4 h-4 animate-spin" /> Consultando chofer...</> : "Consultar Pago del Chofer"}
          </button>
        </div>

      </div>
    </div>
  );
}