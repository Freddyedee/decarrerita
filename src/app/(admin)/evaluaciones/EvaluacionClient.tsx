"use client";

import { useState } from "react";
import { registrarEvaluacion } from "./actions";

// Tipamos los datos que recibiremos del servidor
type ChoferData = {
  id_usuario: number;
  licencia: string;
  estado_aprobacion: string;
  usuario: { nombre: string; apellido: string; email: string };
  evaluacion_psicologica: { calificacion: number; resultado: string; fecha_vencimiento: Date }[];
};

export function EvaluacionClient({ choferes }: { choferes: ChoferData[] }) {

  const [choferSeleccionado, setChoferSeleccionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

// NUEVO: Estado para capturar y mostrar el mensaje de error del backend
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMensaje(null); // Limpiamos errores previos al intentar de nuevo
    
    const formData = new FormData(e.currentTarget);
    
    const response = await registrarEvaluacion(formData); 

    if (response.success) {
      // Si todo sale bien, cerramos el modal
      setLoading(false);
      setChoferSeleccionado(null);
    } else {
      // Si falla (ej. Entidad de dominio lanza error), mostramos el texto y dejamos el modal abierto
      setLoading(false);
      setErrorMensaje(response.error || "Ocurrió un error inesperado al guardar.");
    }

  };

  // Función para cerrar el modal limpiando los errores
  /*const cerrarModal = () => {
    setChoferSeleccionado(null);
    setErrorMensaje(null);
  };**/

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Evaluaciones Psicológicas</h1>
      </div>

      {/* Tabla de Choferes */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Chofer</th>
              <th className="px-6 py-4 font-medium">Licencia</th>
              <th className="px-6 py-4 font-medium">Última Evaluación</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {choferes.map((chofer) => {
              const ultimaEval = chofer.evaluacion_psicologica[0];
              
              return (
                <tr key={chofer.id_usuario} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {chofer.usuario.nombre} {chofer.usuario.apellido}
                    <span className="block text-xs text-slate-500 font-normal">{chofer.usuario.email}</span>
                  </td>
                  <td className="px-6 py-4">{chofer.licencia}</td>
                  <td className="px-6 py-4">
                    {ultimaEval ? (
                      <div>
                        <span className="font-bold">{ultimaEval.calificacion}/100</span>
                        <span className="block text-xs text-slate-500">
                          Vence: {new Date(ultimaEval.fecha_vencimiento).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin registros</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ultimaEval?.resultado === 'aprobado' ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {ultimaEval?.resultado || 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setChoferSeleccionado(chofer.id_usuario)}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors"
                    >
                      Registrar Nota
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Formulario (Aparece solo si hay un chofer seleccionado) */}
      {choferSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Ingresar Nueva Evaluación</h3>

            {/* NUEVO: Alerta visual de error */}
            {errorMensaje && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600">
                <span className="font-bold">Error: </span> {errorMensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input oculto para enviar el ID del chofer a la base de datos */}
              <input type="hidden" name="idChofer" value={choferSeleccionado} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Calificación (0 - 100)</label>
                <input 
                  type="number" 
                  name="calificacion" 
                  min="0" 
                  max="100" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Ej: 75"
                />
                <p className="text-xs text-slate-500 mt-1">Nota mínima aprobatoria: 73</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                {/* 
                  El backend nos exige que no esté vacío. Podemos agregar 'required' 
                  aquí también, pero dejar que falle el servidor es genial para probar la arquitectura.
                */}

                <textarea 
                  name="observaciones"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Detalles de la evaluación psicológica..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setChoferSeleccionado(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Evaluación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}