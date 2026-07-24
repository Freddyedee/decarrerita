"use client";

import { useState } from "react";
import { Power, MapPin, Wallet, Route, ShieldAlert, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// 1. Importamos los nuevos componentes del paso anterior
import VehiculosPanel from "./VehiclesPanel";
import ContactosEmergenciaPanel from "./EmergencyContacts";

export default function ChoferDashboardClient({ 
  choferId, 
  approvalStatus 
}: { 
  choferId: number;
  approvalStatus: string; 
}) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Evaluamos la regla de negocio
  const isApproved = approvalStatus === "APROBADO";

  const toggleStatus = async () => {
    if (!isApproved) return; // Candado de seguridad

    setIsLoading(true);
    const nuevoEstado = !isAvailable; 

    try {
      // Ajusta la ruta aquí si en tu backend la definiste como /api/users/[id]/disponibilidad
      const response = await fetch(`/api/choferes/${choferId}/disponibilidad`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: nuevoEstado }), 
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Fallo al actualizar disponibilidad");
      }

      setIsAvailable(nuevoEstado);
      router.refresh(); 

    } catch (error: any) {
      alert(error.message || "No pudimos conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // =======================================================================
  // VISTA 1: CHOFER EN ESTADO PENDIENTE (Muestra los formularios)
  // =======================================================================
  if (!isApproved) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
        
        {/* Encabezado de Advertencia */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-full flex-shrink-0">
            <ShieldAlert className="text-amber-600 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cuenta en Revisión</h1>
            <p className="text-gray-600 mt-1">
              Para habilitar el radar de traslados, debes completar la información inferior. 
              Posteriormente, el personal administrativo deberá registrar y aprobar tu evaluación psicológica y la revisión de tu vehículo.
            </p>
          </div>
        </div>

        {/* Paneles de Registro */}
        <div className="space-y-6">
          <VehiculosPanel choferId={choferId} />
          <ContactosEmergenciaPanel choferId={choferId} />
        </div>

      </div>
    );
  }

  // =======================================================================
  // VISTA 2: CHOFER APROBADO (Muestra el Radar del Dashboard)
  // =======================================================================
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header del Radar */}
      <div className="bg-white pt-10 pb-6 px-6 rounded-b-[2rem] shadow-sm z-10 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">Panel de Control</p>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAvailable ? "En servicio" : "Fuera de servicio"}
          </h1>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">
          <MapPin className={isAvailable ? "text-blue-500" : "text-gray-400"} />
        </div>
      </div>

      {/* Botón Central Radar */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-4">
        <div className="relative flex items-center justify-center w-72 h-72">
          {isAvailable && (
            <>
              <div className="absolute w-full h-full bg-green-200 rounded-full animate-ping opacity-20"></div>
              <div className="absolute w-3/4 h-3/4 bg-green-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}

          <button 
            onClick={toggleStatus} 
            disabled={isLoading} 
            className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
              isAvailable 
                ? 'bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.6)]' 
                : 'bg-white border-4 border-gray-100 shadow-xl'
            }`}
          >
            <Power className={`w-16 h-16 mb-2 ${isAvailable ? 'text-white' : 'text-gray-300'}`} />
            <span className={`font-bold text-xl tracking-wide ${isAvailable ? 'text-white' : 'text-gray-400'}`}>
              {isLoading ? '...' : (isAvailable ? 'ONLINE' : 'OFFLINE')}
            </span>
          </button>
        </div>
        
        <p className={`mt-8 text-lg font-medium text-center h-8 transition-opacity ${isAvailable ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
          Buscando traslados...
        </p>
      </div>

      {/* Tarjetas de Estadísticas Inferiores */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <Wallet className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-gray-400 text-xs font-medium">Ganancias Hoy</span>
          <span className="text-lg font-bold text-gray-800">$0.00</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <Route className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-gray-400 text-xs font-medium">Viajes Hoy</span>
          <span className="text-lg font-bold text-gray-800">0</span>
        </div>
      </div>
    </div>
  );
}