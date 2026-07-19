// src/app/(cliente)/layout.tsx

import { useCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import Sidebar from "@/components/cliente/Sidebar";
import ClientHeader from "@/components/cliente/Header";

// IMPORTANTE: Importamos tu contenedor centralizado
import { UserContainer } from "@/shared/container/UserContainer"; 

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  /* * SOLUCIÓN AL ERROR DEL HOOK:
   * Next.js y React lanzan un error porque tu función de servidor empieza por "use" (useCurrentRole).
   * El compilador piensa que es un Hook de Frontend y los hooks no se pueden usar en funciones async.
   * Colocamos esta línea para indicarle a ESLint que ignore la regla de hooks aquí, ya que sabemos
   * que es una función de servidor legítima.
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sesion = await useCurrentRole();

  // Guard de seguridad con tu interfaz SesionActual { rol: Rol; usuarioId: number; }
  if (!sesion || sesion.rol !== "CLIENTE") {
    redirect("/login");
  }

  /*
   * SOLUCIÓN HEXAGONAL:
   * Invocamos la instancia del caso de uso que ya está armada dentro de tu UserContainer.
   * Nota: Si en tu UserContainer declaraste 'getUserByIdUseCase' como privado, puedes
   * acceder a él a través del 'UserContainer.userController', pero lo ideal para mantener
   * el desacoplamiento de controladores en el SSR es que los casos de uso sean públicos en el contenedor.
   */
  const usuarioInput = await UserContainer.getUserByIdUseCase.execute(sesion.usuarioId);

  if (!usuarioInput) {
    redirect("/login");
  }

  // Mapeamos el DTO de respuesta (UserResponse) a lo que necesita el <ClientHeader />
  const userHeaderData = {
    // Usamos firstName y lastName que es como lo retorna tu GetUserByIdUseCase
    fullName: `${usuarioInput.firstName} ${usuarioInput.lastName}`, 
    role: "Cliente",
    avatarUrl: undefined, 
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[#E2E4E9] bg-white">
        <Sidebar />
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* CABECERA (Header) */}
        <ClientHeader 
          fullName={userHeaderData.fullName} 
          role={userHeaderData.role} 
        />

        {/* CONTENIDO DINÁMICO */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="mx-auto max-w-5xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}