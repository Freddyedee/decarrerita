import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole"; 
import { UserContainer } from "@/shared/container/UserContainer"; // Importamos tu contenedor
import ChoferDashboardClient from "../ChoferDashboardClient";

export default async function ChoferPage() {
  // 1. Ejecutamos tu verificador de JWT (Seguridad)
  const session = await getCurrentRole();

  // 2. Protegemos la ruta: Si no hay sesión o no es el Rol 3 (CHOFER)
  if (!session || session.rol !== "CHOFER") {
    redirect("/login"); 
  }

  try {
    // 3. NUEVO: Buscamos al chofer en la base de datos usando el ID del token
    const driver = await UserContainer.getDriverByIdUseCase.execute(session.usuarioId);

    // Si por alguna razón el usuario está en el token pero fue borrado de la DB
    if (!driver) {
      redirect("/login");
    }

    // 4. Extraemos el estado de la base de datos
    // Nota: Si en tu DTO (DriverResponse) la propiedad se llama diferente, ajústala aquí (ej. driver.estado)
    const estadoDeAprobacion = driver.status; 

    // 5. Renderizamos el radar pasándole el ID y su estado REAL
    return (
      <ChoferDashboardClient 
        choferId={session.usuarioId} 
        approvalStatus={estadoDeAprobacion} 
      />
    );

  } catch (error) {
    console.error("[ChoferPage] Error al obtener datos del chofer:", error);
    
    // Interfaz de fallback por si la base de datos falla
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600 font-bold">Error interno al cargar el perfil.</p>
      </div>
    );
  }
}