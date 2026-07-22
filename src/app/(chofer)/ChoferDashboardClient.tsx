// src/app/(chofer)/chofer/ChoferDashboardClient.tsx
"use client";

import { useState } from "react";
import { Power, MapPin, Wallet, Route } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChoferDashboardClient({ choferId }: { choferId: number }) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = async () => {
    setIsLoading(true);
    
    // Ahora es un simple interruptor booleano (si era true, pasa a false)
    const nuevoEstado = !isAvailable; 

    try {
      // 👈 Apuntamos a la nueva ruta exclusiva del chofer
      const response = await fetch(`/api/choferes/${choferId}/disponibilidad`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: nuevoEstado }), 
      });

      if (!response.ok) {
        throw new Error("Fallo al actualizar disponibilidad");
      }

      setIsAvailable(nuevoEstado);
      router.refresh(); 

    } catch (error) {
      console.error("Error:", error);
      alert("No pudimos conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Botón Radar */}
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