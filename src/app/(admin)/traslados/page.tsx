import { AdminTrasladosClient } from "./AdminTrasladosClient";

export const metadata = {
  title: "Auditoría de Traslados | Decarrerita Admin",
  description: "Directorio global y auditoría de viajes, tarifas y calificaciones en la plataforma.",
};

export default function AdminTrasladosPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Título de la sección */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Supervisión de Traslados
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Audita en tiempo real los servicios prestados, comisiones generadas y evaluaciones cruzadas de la plataforma.
        </p>
      </div>

      {/* Componente Cliente con toda la interactividad (filtros, búsquedas, KPIs) */}
      <AdminTrasladosClient />
    </div>
  );
}