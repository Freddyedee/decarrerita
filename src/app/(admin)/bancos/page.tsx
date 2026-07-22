import { BancosClient } from "./BancosClient";

export default function BancosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entidades Bancarias</h2>
          <p className="text-slate-500 mt-1">
            Gestiona los bancos disponibles para el registro y pago de choferes.
          </p>
        </div>
      </div>
      
      {/* Aquí inyectamos toda la lógica y la interfaz interactiva */}
      <BancosClient />
    </div>
  );
}