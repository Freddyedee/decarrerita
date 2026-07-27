import ChoferHistorialClient from "./ChoferHistorialClient";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { UserContainer } from "@/shared/container/UserContainer";

export default async function HistorialChoferPage() {
  const session = await getCurrentRole();
    
  if (!session || session.rol !== "CHOFER") {
    redirect("/login");
  }

  // Obtenemos los datos validados del contenedor
  const usuario = await UserContainer.getUserByIdUseCase.execute(session.usuarioId);
  const driver = await UserContainer.getDriverByIdUseCase.execute(session.usuarioId);

  if (!usuario || !driver) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <ChoferHistorialClient choferId={session.usuarioId} />
    </main>
  );
}