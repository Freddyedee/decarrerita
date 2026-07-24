// src/app/(cliente)/layout.tsx

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import Sidebar from "@/components/cliente/Sidebar";
import ClientHeader from "@/components/cliente/Header";
import { UserContainer } from "@/shared/container/UserContainer";

/**
 * Layout compartido por todas las pantallas del cliente.
 * GUARD DE ROL: Verifica permisos en el servidor antes de renderizar.
 */
export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sesion = await getCurrentRole();

  // 1. Validar que la sesión exista y que sea un CLIENTE
  if (!sesion || sesion.rol !== "CLIENTE") {
    redirect("/login");
  }

  // 2. Obtener los datos actualizados del usuario
  const usuarioInput = await UserContainer.getUserByIdUseCase.execute(sesion.usuarioId);

  if (!usuarioInput) {
    redirect("/login");
  }

  const userHeaderData = {
    fullName: `${usuarioInput.firstName} ${usuarioInput.lastName}`,
    role: "Cliente",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      
      {/* SIDEBAR (Mismo estilo que AdminSidebar) */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[#E2E4E9] bg-white shrink-0">
        <Sidebar />
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* CABECERA DE CLIENTE */}
        <ClientHeader 
          fullName={userHeaderData.fullName} 
          role={userHeaderData.role} 
        />

        {/* CONTENIDO SCROLLABLE (Estilo idéntico a layoutadmin) */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}