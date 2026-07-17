
// src/app/(admin)/layout.tsx

import { useCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";

/**
 * Layout compartido por todas las pantallas de administrador.
 *
 * GUARD DE ROL: se hace aquí, no en middleware.ts. Los grupos de rutas
 * entre paréntesis -- (admin), (cliente), etc. -- no agregan segmento
 * a la URL en Next.js (p.ej. esta página vive en "/tarifas", no en
 * "/admin/tarifas"), así que el middleware no puede filtrar por
 * prefijo de ruta hoy. Si en el futuro se decide mover a carpetas
 * reales "admin/", "cliente/" (sin paréntesis), se puede sumar esa
 * capa extra en middleware.ts sin quitar este guard.
 *
 *
 * ALCANCE DE ESTE MENÚ: solo las secciones que le corresponden a
 * ADMIN (dueño del sistema: tarifas, catálogos, usuarios, config).
 * Traslados y Reportes son responsabilidad de STAFF, no de ADMIN --
 * ver esa distinción en el layout de (staff) cuando se construya.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const sesion = await useCurrentRole();

    if (!sesion || sesion.rol !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">

            {/* ============================================================
             * SIDEBAR
             * Mismo lenguaje visual que las cards de Tarifas/Vencimientos:
             * blanco, borde slate-200, acentos teal. Nada de tema oscuro
             * para que el panel se sienta como una sola aplicación.
             * ============================================================ */}
            <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="px-6 py-8 border-b border-slate-200">
                    <p className="text-lg font-bold tracking-tight text-slate-900">Decarrerita</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">panel administrativo</p>
                </div>

                <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
                    <NavLink href="/tarifas" label="Tarifas" />
                    <NavLink href="/vehiculos" label="Vehículos" />
                    <NavLink href="/vehiculos/por-chofer" label="Vehículos por chofer" />
                    <NavLink href="/vehiculos/vencimientos" label="Vencimientos" />
                    <NavLink href="/marcas" label="Marcas" />
                    <NavLink href="/usuarios" label="Usuarios" />
                    <NavLink href="/configuracion" label="Configuración" />
                    <NavLink href="/evaluaciones" label="Evaluaciones psicológicas" />
                    <NavLink href="/pagos" label="Pagos a choferes" />
                    <NavLink href="/reportes" label="Reportes" />
                </nav>
            </aside>

            <main className="flex-1 px-10 py-8">
                {children}
            </main>
        </div>
    );
}

/**
 * Link de navegación del sidebar. Componente local -- si el nav de
 * (cliente)/(chofer)/(staff) termina necesitando el mismo estilo,
 * se mueve a un componente compartido en src/components/ui/nav-link.tsx.
 */
function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
            {label}
        </a>
    );
}