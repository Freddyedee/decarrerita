import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

/**
 * Layout compartido por todas las pantallas de administrador.
 * GUARD DE ROL: Verifica permisos en el servidor antes de renderizar.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const sesion = await getCurrentRole();

    // Nota de negocio: Verifica si tu esquema de base de datos usa "ADMIN" o "PERSONAL_ADMINISTRATIVO"
    // para cubrir a quienes gestionan pagos y reportes.
    if (!sesion || sesion.rol !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
            {/* Sidebar segregado como Client Component */}
            <AdminSidebar />

            {/* Contenedor Principal Scrollable */}
            <main className="flex-1 overflow-y-auto px-10 py-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}