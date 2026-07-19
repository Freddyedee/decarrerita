import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <DashboardHeader
        title="Dashboard Administrativo"
        description="Panel principal de administración de Decarrerita."
        userName="Administrador"
        role="ADMIN"
      />

    </div>
  );
}