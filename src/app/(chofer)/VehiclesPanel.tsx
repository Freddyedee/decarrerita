"use client";

import { useState, useEffect } from "react";
import { Car, Hash, Calendar, Loader2, Plus, Type, Users, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

interface Marca {
  id: number;
  nombre: string; // O 'name', si tu DB de marcas lo devuelve en inglés
}

// 🛠️ 1. ACTUALIZAMOS LA INTERFAZ PARA QUE COINCIDA CON EL DTO DEL BACKEND
interface Vehiculo {
  id: number;
  plate: string;      // Antes 'placa'
  model: string;      // Antes 'modelo'
  year: number;       // Antes 'año'
  brandId: number;    // Antes 'marcaId'
  color: string;      // Nuevo
  passengerCapacity: number; // Nuevo
  status?: string; 
}

export default function VehiculosPanel({ choferId }: { choferId: number }) {
    const router = useRouter();
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados del Formulario (se quedan en español por comodidad interna)
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [año, setAño] = useState(new Date().getFullYear().toString());
    const [marcaId, setMarcaId] = useState("");
    const [color, setColor] = useState("");
    const [capacidad, setCapacidad] = useState("4");

  const fetchData = async () => {
    try {
      const resVehiculos = await fetch(`/api/vehicles/driver/${choferId}`);
      const resMarcas = await fetch(`/api/marcas`);
      
      const jsonVehiculos = await resVehiculos.json();
      const jsonMarcas = await resMarcas.json();

      if (jsonVehiculos.data) setVehiculos(jsonVehiculos.data);
      if (jsonMarcas.data) setMarcas(jsonMarcas.data);

    } catch (error) {
      console.error("Error cargando datos de vehículos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [choferId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🛠️ 2. EL PAYLOAD TRADUCE LOS ESTADOS EN ESPAÑOL AL DTO EN INGLÉS
      const payload = {
        driverId: choferId, 
        brandId: Number(marcaId),  
        plate: placa,              
        model: modelo,             
        year: Number(año),         
        color: color,
        passengerCapacity: Number(capacidad)
      };

      const res = await fetch(`/api/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert("¡Vehículo registrado con éxito! Pendiente de revisión.");
      
      setPlaca("");
      setModelo("");
      setAño(new Date().getFullYear().toString());
      setMarcaId("");
      setColor("");
      setCapacidad("4");
      
      fetchData(); 
      router.refresh();
      
    } catch (error: any) {
      alert(error.message || "Error al registrar vehículo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-6"><Loader2 className="animate-spin text-blue-500" /></div>;

  const faltanVehiculos = vehiculos.length < 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            Flota de Vehículos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Requeridos: Mínimo 1 vehículo registrado
          </p>
        </div>
        {faltanVehiculos ? (
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
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                  placeholder="Ej. ABC12D"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                required
                value={marcaId}
                onChange={(e) => setMarcaId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="" disabled>Seleccione una marca...</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ej. Corolla"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
                
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    required
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Seleccione un color</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Negro">Negro</option>
                    <option value="Plata">Plata</option>
                    <option value="Gris">Gris</option>
                    <option value="Rojo">Rojo</option>
                    <option value="Azul">Azul</option>
                    <option value="Amarillo">Amarillo</option>
                    <option value="Verde">Verde</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (Pasajeros)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    required
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Seleccione capacidad</option>
                    <option value="2">2 Pasajeros (Cabina Simple)</option>
                    <option value="3">3 Pasajeros</option>
                    <option value="4">4 Pasajeros (Sedán estándar)</option>
                    <option value="5">5 Pasajeros (SUV)</option>
                    <option value="6">6 Pasajeros (Van pequeña)</option>
                    <option value="7">7+ Pasajeros (Van grande)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Registrar Vehículo
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Vehículos Registrados</h3>
          {vehiculos.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center mt-10">Aún no has registrado vehículos.</p>
          ) : (
            <ul className="space-y-3">
              {vehiculos.map((vehiculo) => {
                // 🛠️ 3. BUSCAMOS LA MARCA USANDO EL ID CORRECTO Y MOSTRAMOS LAS VARIABLES EN INGLÉS
                const marca = marcas.find(m => m.id === vehiculo.brandId)?.nombre || 'Marca Desconocida';
                return (
                  <li key={vehiculo.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                          {marca} {vehiculo.model} ({vehiculo.year})
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">Placa: {vehiculo.plate}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                          vehiculo.status === 'APROBADO' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {vehiculo.status || 'EN REVISION'}
                        </span>
                      </div>
                    </div>
                    {/* MOSTRAMOS EL COLOR Y LA CAPACIDAD QUE ACABAS DE AGREGAR */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t pt-2 mt-1">
                      <p><span className="font-semibold">Color:</span> {vehiculo.color || 'N/A'}</p>
                      <p><span className="font-semibold">Capacidad:</span> {vehiculo.passengerCapacity || 'N/A'} pax</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}