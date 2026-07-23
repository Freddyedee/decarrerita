"use client";

import { useState, useEffect } from "react";
import { Phone, User, Users, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Contacto {
  id: number;
  contactName: string;
  relationship: string;
  phone: string;
  active: boolean;
}

export default function ContactosEmergenciaPanel({ choferId }: { choferId: number }) {
  const router = useRouter();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados del formulario para el DTO
  const [contactName, setContactName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");

  const fetchContactos = async () => {
  try {
    // 1. Añadimos cache: 'no-store' y un timestamp para forzar una petición fresca
    const res = await fetch(`/api/drivers/${choferId}/emergencyContact?t=${Date.now()}`, {
      cache: 'no-store'
    });
    
    const json = await res.json();
    
    // Validamos si tu backend devuelve el array directamente o dentro de un objeto 'data'
    if (json.data) {
      setContactos(json.data);
    } else if (Array.isArray(json)) {
      setContactos(json); // Por si tu GET devuelve el array plano
    }
  } catch (error) {
    console.error("Error cargando contactos:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchContactos();
  }, [choferId]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch(`/api/drivers/${choferId}/emergencyContact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactName, relationship, phone }),
    });

    const textResponse = await res.text();
    let json;
    
    try {
      json = JSON.parse(textResponse);
    } catch (parseError) {
      throw new Error("El servidor no devolvió un JSON válido.");
    }

    if (!res.ok || json.success === false) {
      throw new Error(json.message || "El servidor rechazó los datos.");
    }

    alert("¡Contacto agregado con éxito!");
    
    // 2. ACTUALIZACIÓN INSTANTÁNEA DE LA UI
    // Inyectamos el nuevo contacto devuelto por el servidor directamente a la lista
    if (json.data) {
      setContactos((prevContactos) => [...prevContactos, json.data]);
    } else {
      // Como respaldo, llamamos a la API fresca
      fetchContactos(); 
    }

    // Limpiamos los inputs
    setContactName("");
    setRelationship("");
    setPhone("");
    
    router.refresh(); // Actualiza el layout de Next.js
    
  } catch (error: any) {
    alert(" Error al registrar: " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) return <div className="flex justify-center p-6"><Loader2 className="animate-spin text-blue-500" /></div>;

  // Regla de Negocio: Mínimo 2 contactos
  const faltanContactos = contactos.length < 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Contactos de Emergencia
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Requeridos: Mínimo 2 (Llevas {contactos.length})
          </p>
        </div>
        {faltanContactos ? (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            Incompleto
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            Completado
          </span>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ej. María Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ej. Madre, Esposo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ej. 0414-1234567"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Agregar Contacto
            </button>
          </form>
        </div>

        {/* Lista de Contactos Agregados */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Contactos Registrados</h3>
          {contactos.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center mt-10">Aún no has registrado ningún contacto.</p>
          ) : (
            <ul className="space-y-3">
              {contactos.map((contacto) => (
                <li key={contacto.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{contacto.contactName}</p>
                    <p className="text-xs text-gray-500">{contacto.relationship}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{contacto.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}