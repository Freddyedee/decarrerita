import { redirect } from "next/navigation";
import { getCurrentRole } from "@/shared/auth/userCurrentRole"; 
import { UserContainer } from "@/shared/container/UserContainer";
import { prisma } from "@/shared/lib/prisma";
import ChoferDashboardClient from "../ChoferDashboardClient";

export const dynamic = 'force-dynamic';

export default async function ChoferPage() {
  const session = await getCurrentRole();

  if (!session || session.rol !== "CHOFER") {
    redirect("/login"); 
  }

  try {
    const driver = await UserContainer.getDriverByIdUseCase.execute(session.usuarioId);
    if (!driver) redirect("/login");

    // 1. Limpiamos espacios y mayúsculas del estado en BD (Ej: "APROBADO   " -> "APROBADO")
    const statusClean = (driver.status || "").trim().toUpperCase();
    const esAprobadoGlobal = statusClean === "APROBADO" || statusClean === "APPROVED" || statusClean === "ACTIVO";

    // 2. Verificamos si tiene vehículo aprobado en BD
    const vehiculoAprobado = await prisma.vehiculo.findFirst({
      where: { 
        id_chofer: session.usuarioId, 
        OR: [
          { estado: "APROBADO" }, { estado: "aprobado" },
          { estado: "ACTIVO" }, { estado: "activo" }
        ]
      }
    });

    // 3. Verificamos si tiene prueba psicológica aprobada
    const psicoAprobada = await prisma.evaluacion_psicologica.findFirst({
      where: { 
        id_chofer: session.usuarioId,
        OR: [
          { calificacion: { gte: 73 } },
          { resultado: "APROBADO" }, { resultado: "APROBADA" },
          { resultado: "aprobado" }, { resultado: "aprobada" }
        ]
      }
    });

    // 4. REGLA DEFINITIVA: Está aprobado si su estado es APROBADO, o si pasó ambas pruebas
    const isApprovedDefinitivo = esAprobadoGlobal || (!!vehiculoAprobado && !!psicoAprobada);

    return (
      <ChoferDashboardClient 
        choferId={session.usuarioId} 
        isApproved={isApprovedDefinitivo}
        approvalStatus={statusClean}
      />
    );

  } catch (error) {
    console.error("[ChoferPage] Error:", error);
    return <div className="p-10 text-center font-bold text-rose-600">Error al cargar el radar.</div>;
  }
}