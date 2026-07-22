import { UsuariosClient } from "./UsuariosClient";

export default function UsuariosPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <p className="text-sm text-slate-500">
          Administra el directorio de clientes y choferes de la plataforma.
        </p>
      </div>

      <UsuariosClient />
    </div>
  );
}