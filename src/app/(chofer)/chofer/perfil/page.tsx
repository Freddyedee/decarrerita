import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { UserContainer } from "@/shared/container/UserContainer";
import ChoferPerfilClient from "./ChoferPerfilClient";

export const dynamic = "force-dynamic";

export default async function ChoferPerfilPage() {
  const session = await getCurrentRole();

  if (!session || session.rol !== "CHOFER") {
    redirect("/login");
  }

  // 1. Obtenemos datos de usuario
  const usuario = await UserContainer.getUserByIdUseCase.execute(session.usuarioId);
  // 2. Obtenemos datos de chofer (licencia, estatus)
  const driver = await UserContainer.getDriverByIdUseCase.execute(session.usuarioId);

  if (!usuario || !driver) {
    redirect("/login");
  }

  return (
    <ChoferPerfilPageContent 
      usuario={usuario}
      licenseNumber={driver.licenseNumber}
      approvalStatus={driver.status}
    />
  );
}

function ChoferPerfilPageContent({ usuario, licenseNumber, approvalStatus }: any) {
  return (
    <ChoferPerfilClient 
      usuario={usuario} 
      licenseNumber={licenseNumber} 
      approvalStatus={approvalStatus} 
    />
  );
}