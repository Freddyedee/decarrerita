import ChoferWalletClient from "./ChoferWalletClient";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { UserContainer } from "@/shared/container/UserContainer";

export default async function WalletChoferPage() {
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
    <main className="min-h-screen bg-slate-50 pb-12">
      <ChoferWalletClient choferId={session.usuarioId} />
    </main>
  );
}