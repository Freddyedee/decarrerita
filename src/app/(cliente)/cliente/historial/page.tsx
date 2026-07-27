// src/app/(cliente)/cliente/historial/page.tsx

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import { WalletContainer } from "@/shared/container/WalletContainer";
import ClienteHistorialClient from "./ClienteHistorialClient";

export default async function HistorialPage() {
  const sesion = await getCurrentRole();
  if (!sesion || sesion.rol !== "CLIENTE") redirect("/login");

  let recargas: any[] = [];

  try {
    recargas = await WalletContainer.getHistorialRecargasUseCase.execute(sesion.usuarioId);
  } catch (error) {
    console.error("Error al obtener recargas:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <ClienteHistorialClient
        clienteId={sesion.usuarioId}
        initialRecargas={recargas}
      />
    </main>
  );
}