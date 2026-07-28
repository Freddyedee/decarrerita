// src/components/cliente/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Wallet, 
  History, 
  UserRound,
  LayoutDashboard
} from "lucide-react";

export const CLIENT_MENU = [
  {
    id: "trip",
    label: "Solicitar traslado",
    href: "/cliente",
    icon: Car,
  },
  {
    id: "wallet",
    label: "Wallet",
    href: "/cliente/wallet",
    icon: Wallet,
  },
  {
    id: "history",
    label: "Historial",
    href: "/cliente/historial",
    icon: History,
  },
  {
    id: "profile",
    label: "Mi perfil",
    href: "/cliente/perfil",
    icon: UserRound,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-slate-50/90 via-white to-blue-50/40 backdrop-blur-sm border-r border-white/30 shadow-2xl shadow-slate-200/30 overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[250px] h-[250px] bg-teal-200/20 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      {/* Cabecera */}
      <div className="relative px-6 py-6 border-b border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
          <p className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Decarrerita
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-slate-100/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-slate-200/50">
            Cliente
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Menú */}
      <nav className="relative flex flex-col flex-1 px-3 py-6 gap-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
          Navegación principal
        </p>

        {CLIENT_MENU.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/70 backdrop-blur-sm text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50"
                  : "text-slate-600 hover:bg-white/40 hover:text-slate-900 hover:shadow-sm"
              }`}
            >
              {/* Indicador lateral activo */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-teal-400 rounded-r-full shadow-md shadow-blue-500/30"></span>
              )}

              <Icon 
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-slate-400 group-hover:text-slate-700"
                }`} 
              />
              
              <span className="flex-1">{item.label}</span>

              {/* Flecha sutil en hover */}
              <span className={`text-xs text-slate-300 transition-all duration-200 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              }`}>
                →
              </span>
            </Link>
          );
        })}

        {/* Separador visual */}
        <div className="my-4 border-t border-slate-200/30 mx-3"></div>

        {/* Footer del sidebar (opcional) */}
        <div className="mt-auto px-3 py-2">
          <div className="text-[10px] text-slate-400/70 text-center tracking-wider">
            v1.0.0
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}