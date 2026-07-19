"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/tarifas", label: "Tarifas" },
    { href: "/vehiculos", label: "Vehículos" },
    { href: "/vehiculos/por-chofer", label: "Vehículos por chofer" },
    { href: "/vehiculos/vencimientos", label: "Vencimientos" },
    { href: "/marcas", label: "Marcas" },
    { href: "/usuarios", label: "Usuarios" },
    { href: "/configuracion", label: "Configuración" },
    { href: "/evaluaciones", label: "Evaluaciones psicológicas" },
    { href: "/pagos", label: "Pagos a choferes" },
    { href: "/reportes", label: "Reportes" },
  ];

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="px-6 py-8 border-b border-slate-200">
        <p className="text-lg font-bold tracking-tight text-slate-900">Decarrerita</p>
        <p className="text-xs text-slate-400 mt-1 font-mono">panel administrativo</p>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4 text-sm flex-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-teal-50 text-teal-700" // Acento teal para la ruta activa
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}