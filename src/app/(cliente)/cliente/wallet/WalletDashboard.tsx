// src/app/(cliente)/cliente/wallet/WalletDashboard.tsx
"use client";

import RecargaForm from "@/components/cliente/RecargaForm";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CircleDollarSign,
  Clock,
  Banknote,
  TrendingUp,
  Activity
} from "lucide-react";

interface Transaccion {
  id: number;
  tipo: string;
  monto: number;
  fecha: string;
  estado: string;
  banco?: string;
  descripcion?: string;
}

interface WalletDashboardProps {
  walletData: { saldoDisponible: number; moneda: string };
  bancos: { id_banco: any; nombre: string }[];
  transacciones: Transaccion[];
}

export default function WalletDashboard({ walletData, bancos, transacciones }: WalletDashboardProps) {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Fondo decorativo con azul muy sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-50/60 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header con acento azul oscuro */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-900 rounded-xl shadow-sm">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black">
              Mi Wallet
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Administra tu saldo y realiza recargas de forma rápida y segura.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta principal de saldo */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-full flex flex-col transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CircleDollarSign className="w-4 h-4" /> Saldo disponible
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Activo
                </span>
              </div>
              
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="text-4xl font-extrabold text-black tracking-tight">
                    ${walletData.saldoDisponible.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1 font-medium">{walletData.moneda}</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-semibold text-blue-800">+12%</span>
                </div>
              </div>

              {/* Barra de progreso azul oscuro */}
              <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-900 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((walletData.saldoDisponible / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">Límite sugerido: $100.00</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Recargas</p>
                  <p className="text-sm font-bold text-black">3</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Gastos</p>
                  <p className="text-sm font-bold text-black">$38.50</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: formulario + movimientos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulario de recarga */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="w-5 h-5 text-blue-700" />
                <h3 className="font-semibold text-black">Recargar saldo</h3>
                <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                  Procesamiento seguro
                </span>
              </div>
              <RecargaForm bancos={bancos} />
            </div>

            {/* Movimientos recientes */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-black">Movimientos recientes</h3>
                </div>
                <button className="text-xs text-blue-700 font-medium transition-colors hover:text-blue-900">
                  Ver todos →
                </button>
              </div>

              <div className="space-y-3">
                {transacciones.length > 0 ? (
                  transacciones.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          t.tipo === "recarga" ? "bg-blue-100 text-blue-700" : "bg-blue-200 text-blue-800"
                        }`}>
                          {t.tipo === "recarga" ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">
                            {t.tipo === "recarga" ? "Recarga" : "Pago de traslado"}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span>{t.fecha}</span>
                            {t.banco && <span>• {t.banco}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          t.tipo === "recarga" ? "text-blue-800" : "text-gray-700"
                        }`}>
                          {t.tipo === "recarga" ? "+" : "-"}${t.monto.toFixed(2)}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          t.estado === "completado" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-300 text-gray-900"
                        }`}>
                          {t.estado}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No hay movimientos recientes.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}