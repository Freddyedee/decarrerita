// src/app/(admin)/layout.tsx

import { useCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";

/**
 * Layout compartido por todas las pantallas de administrador.
 *
 * TODO FUTURO: cuando Auth esté listo, este componente debe
 * volverse un Server Component async que lea la sesión real
 * (hoy usa el mock de useCurrentRole). La validación de abajo
 * (`if (rol !== "ADMIN")`) ya queda correcta tal cual — solo
 * cambia de dónde viene `rol`.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const { rol } = useCurrentRole();

    if (rol !== "ADMIN") {
        redirect("/"); // TODO futuro: redirigir a /login cuando exista esa pantalla
    }

    return (
        <div className="flex min-h-screen bg-[#F4F5F7] text-[#12131A]">

            <aside className="w-60 shrink-0 bg-[#12131A] text-white flex flex-col">
                <div className="px-6 py-8 border-b border-white/10">
                    <p className="font-display text-lg tracking-tight">Decarrerita</p>
                    <p className="text-xs text-white/50 mt-1 font-mono">panel administrativo</p>
                </div>

                <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
                    <a href="/dashboard" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Resumen
                    </a>
                    <a href="/tarifas" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Tarifas
                    </a>
                    <a href="/vehiculos" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Vehículos y revisiones
                    </a>
                    <a href="/marcas" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Marcas
                    </a>
                    <a href="/traslados" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Traslados
                    </a>
                    <a href="/reportes" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Reportes
                    </a>

                    <a href="/vehiculos/por-chofer" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Vehículos por chofer
                    </a>

                    <a href="/vehiculos/vencimientos" className="px-3 py-2 rounded hover:bg-white/10 transition-colors">
                        Vencimientos
                    </a>
                </nav>
            </aside>

            <main className="flex-1 px-10 py-8">
                {children}
            </main>
        </div>
    );
}