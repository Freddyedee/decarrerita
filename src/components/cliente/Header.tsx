interface ClientHeaderProps {
  fullName: string;
  role: string;
}

export default function ClientHeader({
  fullName,
  role,
}: ClientHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Título del sistema */}
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-[#12131A]">
          Decarrerita
        </h1>
      </div>

      {/* Información del usuario */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            Hola, {fullName}
          </p>
          <p className="text-xs text-slate-500">
            {role}
          </p>
        </div>
        
        {/* Círculo simple como Avatar temporal (sin depender de componentes extra) */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E7C86] text-sm font-semibold text-white">
          {fullName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}