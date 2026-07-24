"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Car, 
  AlertTriangle, 
  Tags, 
  Banknote, 
  Wallet, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Building,
  CreditCard
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  // Agrupamos los enlaces por módulos de negocio
  const navGroups = [
    {
      title: "Principal",
      links: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Operaciones",
      links: [
        { href: "/usuarios", label: "Usuarios y Choferes", icon: Users },
        { href: "/traslados", label: "Viajes / Traslados", icon: MapPin },
        { href: "/evaluaciones", label: "Evals. Psicológicas", icon: ShieldCheck },
      ],
    },
    {
      title: "Flota de Vehículos",
      links: [
        { href: "/vehiculos", label: "Gestión de Flota", icon: Car },
        { href: "/vehiculos/vencimientos", label: "Vencimientos", icon: AlertTriangle },
        { href: "/marcas", label: "Marcas y Modelos", icon: Tags },
      ],
    },
    {
      title: "Finanzas",
      links: [
        { href: "/tarifas", label: "Tarifas", icon: Banknote },
        { href: "/pagos", label: "Pagos a Choferes", icon: Wallet },
        { href: "/recargas", label: "Validar Recargas", icon: CreditCard },
        { href: "/bancos", label: "Entidades Bancarias", icon: Building },
        { href: "/reportes", label: "Reportes Financieros", icon: BarChart3 },
      ],
    },
    {
      title: "Sistema",
      links: [
        { href: "/configuracion", label: "Configuración", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Cabecera del Sidebar */}
      <div className="px-6 py-6 border-b border-slate-200">
        <p className="text-xl font-bold tracking-tight text-slate-900">Decarrerita</p>
        <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-100 inline-block px-2 py-0.5 rounded-full">
          ADMIN PANEL
        </p>
      </div>

      {/* Navegación Scrolleable */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-6 custom-scrollbar">
        {navGroups.map((group, index) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {group.title}
            </p>
            {group.links.map((link) => {
              // Corrección del bug de rutas activas:
              const isActive = pathname === link.href;

              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100" // Activo
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900" // Inactivo
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}