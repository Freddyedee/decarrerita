"use client";

import { useState } from "react";
import { registrarRevisionVehicular } from "./actions";

type VehiculoData = {
  id_vehiculo: number;
  placa: string;
  modelo: string;
  estado: string;
  chofer: {
    usuario: { nombre: string; apellido: string };
  };
  revision_vehicular: { calificacion: number; resultado: string; fecha_vencimiento: Date }[];
};

export function VehiculoClient({ vehiculos }: { vehiculos: VehiculoData[] }) {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para capturar y mostrar el mensaje de error de las reglas de dominio
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMensaje(null); // Limpiamos errores previos
    
    const formData = new FormData(e.currentTarget);
    
    // Capturamos la respuesta del caso de uso a través del Server Action
    const response = await registrarRevisionVehicular(formData);
    
    if (response.success) {
      setLoading(false);
      setVehiculoSeleccionado(null); // Cerramos el modal si fue exitoso
    } else {
      setLoading(false);
      // Mostramos el error de dominio en la pantalla
      setErrorMensaje(response.error || "Ocurrió un error inesperado al guardar.");
    }
  };

  const cerrarModal = () => {
    setVehiculoSeleccionado(null);
    setErrorMensaje(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Revisión de Vehículos</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Vehículo</th>
              <th className="px-6 py-4 font-medium">Propietario</th>
              <th className="px-6 py-4 font-medium">Última Revisión</th>
              <th className="px-6 py-4 font-medium">Estado General</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vehiculos.map((vehiculo) => {
              const ultimaRev = vehiculo.revision_vehicular[0];
              
              return (
                <tr key={vehiculo.id_vehiculo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{vehiculo.placa}</span>
                    <span className="text-xs text-slate-500">{vehiculo.modelo}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {vehiculo.chofer.usuario.nombre} {vehiculo.chofer.usuario.apellido}
                  </td>
                  <td className="px-6 py-4">
                    {ultimaRev ? (
                      <div>
                        <span className="font-bold">{ultimaRev.calificacion}/100</span>
                        <span className="block text-xs text-slate-500">
                          Vence: {new Date(ultimaRev.fecha_vencimiento).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin registros</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {/* Renderizamos el estado basado en lo que devuelve la Entidad */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ultimaRev?.resultado === 'APPROVED' ? 'bg-teal-100 text-teal-700' : 
                      ultimaRev?.resultado === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ultimaRev?.resultado || 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setVehiculoSeleccionado(vehiculo.id_vehiculo)}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors"
                    >
                      Evaluar Vehículo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {vehiculoSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Ingresar Revisión Técnica</h3>
            
            {/* Alerta visual si el UseCase lanza un error */}
            {errorMensaje && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600">
                <span className="font-bold">Error: </span> {errorMensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="idVehiculo" value={vehiculoSeleccionado} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Calificación (0 - 100)</label>
                <input 
                  type="number" 
                  name="calificacion" 
                  min="0" 
                  max="100" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Ej: 80"
                />
                {/* Mostramos la regla de negocio directamente al usuario */}
                <p className="text-xs text-slate-500 mt-1">Nota mínima aprobatoria: 65</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea 
                  name="observaciones"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Estado del motor, frenos, cauchos..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Revisión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}