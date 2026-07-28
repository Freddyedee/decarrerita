// src/app/calificar/[id]/page.tsx
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import CalificarClient from "./CalificarClient";

export const metadata = {
  title: "Calificar Servicio | Decarrerita",
  description: "Ayúdanos a mantener una comunidad segura y confiable.",
};

export default async function CalificarPage({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await getCurrentRole();
  
  // Si no está logueado, al login
  if (!sesion || !sesion.rol) {
    redirect("/login");
  }

  const { id } = await params;
  const trasladoId = Number(id);

  if (isNaN(trasladoId)) {
    redirect(sesion.rol === "CLIENTE" ? "/cliente" : "/chofer");
  }

  // Determinamos si es cliente o chofer para adaptar la pregunta en el frontend
  const calificadorEsCliente = sesion.rol === "CLIENTE";

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <CalificarClient 
        trasladoId={trasladoId} 
        calificadorEsCliente={calificadorEsCliente} 
        rolUsuario={sesion.rol}
      />
    </main>
  );
}