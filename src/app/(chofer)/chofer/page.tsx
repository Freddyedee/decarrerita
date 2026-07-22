// src/app/(chofer)/chofer/page.tsx
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole"; // 👈 Tu función personalizada
import ChoferDashboardClient from "../ChoferDashboardClient";

export default async function ChoferPage() {
  // 1. Ejecutamos tu verificador de JWT
  const session = await getCurrentRole();

  // 2. Protegemos la ruta: Si no hay sesión o no es el Rol 3 (CHOFER)
  if (!session || session.rol !== "CHOFER") {
    redirect("/login"); 
  }

  // 3. Renderizamos el radar pasándole el ID real que sacamos del token
  return <ChoferDashboardClient choferId={session.usuarioId} />;
}