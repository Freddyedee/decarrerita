// src/components/cliente/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Wallet, 
  History, 
  UserRound 
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
    <div className="flex flex-col h-full bg-white">
      {/* CABECERA CON INSIGNIA "PANEL CLIENTE" */}
      <div className="px-6 py-6 border-b border-[#E2E4E9]">
        <p className="text-lg font-bold tracking-tight text-slate-900">
          Decarrerita
        </p>
        <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-100 inline-block px-2 py-0.5 rounded-full">
          PANEL CLIENTE
        </p>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex flex-col flex-1 px-4 py-6 gap-1 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Menú Principal
        </p>

        {CLIENT_MENU.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}