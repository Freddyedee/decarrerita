// src/app/viaje/[id]/page.tsx
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import ViajeClient from "./ViajeClient";

export const metadata = {
  title: "Viaje en Curso | Decarrerita",
  description: "Seguimiento en tiempo real de tu traslado",
};

export default async function ViajePage({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await getCurrentRole();

  if (!sesion || !sesion.usuarioId) {
    redirect("/login");
  }

  const { id } = await params;
  const trasladoId = Number(id);

  if (isNaN(trasladoId)) {
    redirect(sesion.rol === "CLIENTE" ? "/cliente" : "/chofer");
  }

  // Carga inicial del traslado desde PostgreSQL
  const trasladoRaw = await prisma.traslado.findUnique({
    where: { id_traslado: trasladoId },
    include: {
      chofer: {
        include: {
          usuario: {
            select: { nombre: true, apellido: true, telefono: true, email: true }
          }
        }
      },
      cliente: {
        include: {
          usuario: {
            select: { nombre: true, apellido: true, telefono: true, email: true }
          }
        }
      },
      vehiculo: {
        include: {
          marca: {
            select: { nombre: true }
          }
        }
      },
      tarifa: true
    }
  });

  if (!trasladoRaw) {
    redirect(sesion.rol === "CLIENTE" ? "/cliente" : "/chofer");
  }

  // Serializamos valores BigInt/Decimal para Next.js
  const traslado = JSON.parse(JSON.stringify(trasladoRaw));

  return (
    <main className="min-h-screen bg-slate-100">
      <ViajeClient 
        initialTraslado={traslado} 
        usuarioId={sesion.usuarioId} 
        rolUsuario={sesion.rol} 
      />
    </main>
  );
}