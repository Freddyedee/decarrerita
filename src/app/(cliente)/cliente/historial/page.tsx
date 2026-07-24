// src/app/(cliente)/cliente/historial/page.tsx

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import { WalletContainer } from "@/shared/container/WalletContainer";

// Función utilitaria para formatear la fecha
function formatearFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

// Función utilitaria para los colores del estado
function obtenerEstiloEstado(estado: string) {
  switch (estado) {
    case "APROBADA":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PENDIENTE":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "RECHAZADA":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default async function HistorialPage() {
  const sesion = await getCurrentRole();
  if (!sesion || sesion.rol !== "CLIENTE") redirect("/login");

  let recargas: any[] = [];
  
  try {
    // Llamamos a tu caso de uso real que inyecta los repositorios
    recargas = await WalletContainer.getHistorialRecargasUseCase.execute(sesion.usuarioId);
  } catch (error) {
    console.error("Error al obtener el historial de recargas:", error);
    // Si la wallet no existe (usuario recién creado), el arreglo queda vacío
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Historial de Actividad
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Revisa tus recargas de saldo y traslados realizados.
        </p>
      </div>

      {/* Contenedor principal estilo tarjeta */}
      <div className="bg-white border border-[#E2E4E9] rounded-xl shadow-sm overflow-hidden">
        
        {/* TABS SIMULADOS (Para futura integración con Traslados) */}
        <div className="flex border-b border-[#E2E4E9] px-6">
          <button className="px-4 py-3 border-b-2 border-[#0E7C86] text-sm font-semibold text-[#0E7C86]">
            Recargas
          </button>
          <button className="px-4 py-3 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Traslados (Próximamente)
          </button>
        </div>

        {/* Tabla de Recargas */}
        <div className="p-0 overflow-x-auto">
          {recargas.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No tienes recargas registradas aún.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Fecha de Solicitud</th>
                  <th className="px-6 py-3 font-medium">Referencia</th>
                  <th className="px-6 py-3 font-medium">Monto</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E4E9]">
                {recargas.map((recarga) => (
                  <tr key={recarga.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">
                      {formatearFecha(recarga.fechaSolicitud)}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {recarga.referenciaPago}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      +${recarga.monto.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${obtenerEstiloEstado(
                          recarga.status
                        )}`}
                      >
                        {recarga.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}