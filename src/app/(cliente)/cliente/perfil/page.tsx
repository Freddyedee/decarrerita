import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { UserContainer } from "@/shared/container/UserContainer";
import { redirect } from "next/navigation";
import PerfilClient from "./PerfilClient";
import { UserResponse } from "@/modules/user/application/dto/UserResponse";

export default async function PerfilPage() {
  const sesion = await getCurrentRole();
  if (!sesion || sesion.rol !== "CLIENTE") {
    redirect("/login");
  }

  // Retorna directamente un UserResponse
  const usuario: UserResponse | null = await UserContainer.getUserByIdUseCase.execute(sesion.usuarioId);
  if (!usuario) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configuración de Perfil</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Consulta y gestiona tus datos personales en la plataforma.
        </p>
      </div>

      <PerfilClient usuario={usuario} />
    </div>
  );
}