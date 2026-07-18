import SolicitarTrasladoForm from "@/components/cliente/SolicitarTrasladoForm";

export default function ClienteDashboardPage() {
  return (
    <div className="flex flex-col h-full gap-6 lg:flex-row">
      
      {/* Columna Izquierda: Formulario e Instrucciones */}
      <div className="flex w-full flex-col gap-6 lg:w-1/3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            ¿A dónde vamos?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa tu punto de partida y destino para solicitar un chofer.
          </p>
        </div>

        <SolicitarTrasladoForm />
      </div>

      {/* Columna Derecha: Mapa Placeholder */}
      <div className="relative flex w-full flex-1 items-center justify-center rounded-xl border border-slate-300 bg-slate-200 min-h-[400px]">
        <div className="text-center">
          <span className="text-4xl">🗺️</span>
          <p className="mt-2 text-sm font-medium text-slate-500">
            El mapa interactivo se cargará aquí
          </p>
        </div>
      </div>

    </div>
  );
}