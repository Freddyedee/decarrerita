"use client";

import { useState, useEffect } from "react";
import { 
  Power, Wallet, Route, ShieldAlert, CheckCircle, Car, 
  FileCheck2, Navigation, Check, X, Loader2, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModalCalificacion from "@/components/ui/ModalCalificacion";
import { verificarViajeActivo, verificarViajePendienteCalificar } from "@/app/(cliente)/cliente/actions"; // O donde esté la acción


interface Vehiculo {
  id: number;
  plate: string;
  model: string;
  year: number;
  status?: string;
}

interface OfertaViaje {
  asignacionId: number;
  trasladoId: number;
  costoEstimado: number;
  distanciaKm: number;
}

interface ViajeActivo {
  trasladoId: number;
  estado: "EN_CAMINO" | "EN_CURSO";
  costoEstimado: number;
  distanciaKm: number;
}

export default function ChoferDashboardClient({ 
  choferId, 
  isApproved = false,
  approvalStatus
}: { 
  choferId: number;
  isApproved: boolean;
  approvalStatus: string;
}) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  // Modal de vehículos al ponerse ONLINE
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectingVehicle, setSelectingVehicle] = useState(false);

  // Estados del viaje
  const [oferta, setOferta] = useState<OfertaViaje | null>(null);
  const [viajeActivo, setViajeActivo] = useState<ViajeActivo | null>(null);
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  // 2. ESTADO PARA EL MODAL
  const [trasladoPendienteId, setTrasladoPendienteId] = useState<number | null>(null);


  useEffect(() => {
    if (!choferId) return;
    async function revisarEstadoViaje() {
      // 1. Redirigir a pantalla de viaje si está en una carrera activa
      const viajeRes = await verificarViajeActivo();
      if (viajeRes.success && viajeRes.trasladoId) {
        router.push(`/viaje/${viajeRes.trasladoId}`);
        return;
      }

      // 2. Redirigir a calificación si tiene una pendiente
      const califRes = await verificarViajePendienteCalificar(false);
      if (califRes.success && califRes.trasladoId) {
        router.push(`/calificar/${califRes.trasladoId}`);
      }
    }
    revisarEstadoViaje();
  }, [choferId, router]);

  // 3. EFECTO AL CARGAR EL DASHBOARD O AL TERMINAR UN VIAJE
  useEffect(() => {
    if (!choferId) return;
    async function revisarPendientes() {
      const res = await verificarViajePendienteCalificar(false);
      if (res.success && res.trasladoId) {
        
        router.push(`/calificar/${res.trasladoId}`);
      }
    }
    revisarPendientes();
  }, [choferId, router]);

  // Cargar vehículos para el modal
  useEffect(() => {
    fetch(`/api/vehicles/driver/${choferId}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => setVehiculos(Array.isArray(data) ? data : (data.data || [])))
      .catch(() => {});
  }, [choferId]);

  // Polling de ofertas cada 3 segundos si está ONLINE
  useEffect(() => {
    if (!isAvailable || viajeActivo) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/drivers/${choferId}/pendiente`);
        if (res.ok) {
          const body = await res.json();
          setOferta(body.data || null);
        }
      } catch (e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [isAvailable, choferId, viajeActivo]);

  // 1. Función para cuando el chofer presiona el botón principal
  const handleToggleOnline = async () => {
    if (!isApproved) return;
    if (isAvailable) {
      // APAGAR RADAR (Desconectarse)
      setIsLoading(true);
      try {
        await fetch(`/api/drivers/${choferId}/disponibilidad`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disponible: false }), // 👈 Mandamos false a la base de datos
        });
        setIsAvailable(false);
        setOferta(null);
      } catch {
        alert("Error al intentar desconectarse.");
      } finally { 
        setIsLoading(false); 
      }
    } else {
      // ENCENDER RADAR: Verificamos vehículos primero
      const aprobados = vehiculos.filter(v => (v.status || "").toUpperCase() === "APROBADO" || (v.status || "").toUpperCase() === "ACTIVO");
      if (aprobados.length === 0 && vehiculos.length > 0) {
        setShowVehicleModal(true);
      } else if (vehiculos.length === 0) {
        alert("No tienes vehículos registrados. Ve a Mis Herramientas para registrar uno.");
      } else {
        setShowVehicleModal(true);
      }
    }
  };

  // 2. Función para cuando el chofer elige su vehículo en el Modal y pasa a ONLINE
  const handleConfirmVehicleSelection = async (vehicleId: number) => {
    setSelectingVehicle(true);
    try {
      // Seleccionamos el vehículo en el backend
      await fetch(`/api/vehicles/${vehicleId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: choferId }),
      });

      // 👈 ENCENDEMOS DISPONIBILIDAD EN BD A TRUE
      const resDisp = await fetch(`/api/drivers/${choferId}/disponibilidad`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: true }),
      });

      if (!resDisp.ok) {
        throw new Error("El servidor no pudo activar tu disponibilidad en la base de datos.");
      }

      setIsAvailable(true);
      setShowVehicleModal(false);
    } catch (e: any) { 
      alert(e.message || "Error al activar vehículo y disponibilidad."); 
    } finally { 
      setSelectingVehicle(false); 
    }
  };
  
  const handleResponderOferta = async (respuesta: "ACEPTADO" | "RECHAZADO") => {
    if (!oferta) return;
    setProcesandoAccion(true);
    try {
      await fetch(`/api/traslados/${oferta.trasladoId}/responder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asignacionId: oferta.asignacionId, respuesta }),
      });
      if (respuesta === "ACEPTADO") {
        setViajeActivo({
          trasladoId: oferta.trasladoId, estado: "EN_CAMINO",
          costoEstimado: oferta.costoEstimado, distanciaKm: oferta.distanciaKm,
        });
      }
      setOferta(null);
    } finally { setProcesandoAccion(false); }
  };

  const handleIniciarViaje = async () => {
    if (!viajeActivo) return;
    setProcesandoAccion(true);
    try {
      await fetch(`/api/traslados/${viajeActivo.trasladoId}/iniciar`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trasladoId: viajeActivo.trasladoId }),
      });
      setViajeActivo({ ...viajeActivo, estado: "EN_CURSO" });
    } finally { setProcesandoAccion(false); }
  };

  const handleCompletarViaje = async () => {
    if (!viajeActivo) return;
    setProcesandoAccion(true);
    try {
      await fetch(`/api/traslados/${viajeActivo.trasladoId}/completar`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trasladoId: viajeActivo.trasladoId }),
      });
      alert("🎉 ¡Viaje finalizado! Ganancia acreditada a tu Wallet.");
      setViajeActivo(null);
      router.refresh();
    } finally { setProcesandoAccion(false); }
  };

  return (
    // ¡AQUÍ ESTÁ EL ARREGLO VISUAL! pt-16 sm:pt-20 empuja todo hacia abajo de la cabecera fija
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 pt-16 sm:pt-20 space-y-8 min-h-screen flex flex-col justify-between">

      {/* 4. INYECCIÓN DEL MODAL PARA EL CHOFER */}
      {trasladoPendienteId !== null && (
        <ModalCalificacion
          trasladoId={trasladoPendienteId}
          calificadorEsCliente={false} // Es el chofer calificando al cliente
          onClose={() => setTrasladoPendienteId(null)}
        />
      )}
      
      {/* Cabecera del Radar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Central de Operaciones</h1>
            <span className="text-xs bg-teal-100 text-[#0E7C86] px-2.5 py-0.5 rounded-full font-mono font-extrabold">RADAR</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Estatus en servidor: <strong className="text-slate-700">{approvalStatus || "APROBADO"}</strong></p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-full sm:w-auto justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase">GPS:</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-xs font-extrabold ${isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isAvailable ? 'CONECTADO' : 'DESCONECTADO'}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        
        {/* SI NO ESTÁ APROBADO: Muestra alerta limpia */}
        {!isApproved && (
          <div className="max-w-xl w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-950 text-lg">Evaluación en Proceso</h3>
                <p className="text-xs text-amber-800 mt-1">
                  Tu perfil está siendo auditado o te faltan requisitos por completar.
                </p>
              </div>
            </div>
            <Link 
              href="/chofer/perfil"
              className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow transition-all"
            >
              Ir a Mis Herramientas para revisar vehículos y contactos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* SI ESTÁ APROBADO: BOTÓN GIGANTE ONLINE / OFFLINE */}
        {isApproved && !viajeActivo && (
          <div className="flex flex-col items-center py-6">
            <button
              type="button"
              onClick={handleToggleOnline}
              disabled={isLoading}
              className={`w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
                isAvailable 
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-8 border-emerald-100 shadow-[0_0_50px_rgba(16,185,129,0.4)]' 
                  : 'bg-white border-8 border-slate-100 shadow-2xl hover:border-slate-200'
              }`}
            >
              <Power className={`w-16 h-16 mb-2 ${isAvailable ? 'text-white' : 'text-slate-300'}`} />
              <span className={`font-black text-xl tracking-widest ${isAvailable ? 'text-white' : 'text-slate-600'}`}>
                {isLoading ? '...' : (isAvailable ? 'ONLINE' : 'OFFLINE')}
              </span>
            </button>
            <p className={`mt-6 text-sm font-bold transition-all ${isAvailable ? 'text-emerald-600 opacity-100 animate-pulse' : 'opacity-0'}`}>
              📡 Escaneando solicitudes de viaje cercanas...
            </p>
          </div>
        )}

        {/* VIAJE EN CURSO */}
        {viajeActivo && (
          <div className="max-w-xl w-full bg-slate-900 text-white p-6 rounded-3xl shadow-2xl space-y-6 text-left border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase">
                {viajeActivo.estado === "EN_CAMINO" ? "🟡 En camino al cliente" : "🟢 Viaje en Curso"}
              </span>
              <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full">#{viajeActivo.trasladoId}</span>
            </div>
            <div className="flex justify-between items-baseline py-2">
              <div>
                <span className="text-xs text-slate-400 uppercase block">Ganancia Neta</span>
                <span className="text-4xl font-extrabold text-emerald-400 font-mono">${viajeActivo.costoEstimado.toFixed(2)}</span>
              </div>
              <span className="text-sm font-mono bg-slate-800 px-3 py-1.5 rounded-xl">{viajeActivo.distanciaKm} km</span>
            </div>
            {viajeActivo.estado === "EN_CAMINO" ? (
              <button onClick={handleIniciarViaje} disabled={procesandoAccion} className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-black py-4 rounded-2xl flex justify-center gap-2">
                {procesandoAccion ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />} Llegué por el Cliente / Iniciar Viaje
              </button>
            ) : (
              <button onClick={handleCompletarViaje} disabled={procesandoAccion} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-2xl flex justify-center gap-2">
                {procesandoAccion ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} Finalizar Viaje y Cobrar
              </button>
            )}
          </div>
        )}
      </div>

      {/* MODAL VEHÍCULOS */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2"><Car className="w-5 h-5 text-[#0E7C86]" /> Elige tu Vehículo</h3>
              <button onClick={() => setShowVehicleModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {vehiculos.map((v) => (
                <button key={v.id} onClick={() => handleConfirmVehicleSelection(v.id)} disabled={selectingVehicle} className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#0E7C86] hover:bg-teal-50/50 flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{v.model} ({v.year})</p>
                    <p className="text-xs font-mono text-slate-400">Placa: {v.plate}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0E7C86]">Elegir ➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TARJETA FLOTANTE DE OFERTA */}
      {oferta && !viajeActivo && (
        <div className="fixed inset-x-4 top-24 max-w-lg mx-auto z-50 bg-white border-2 border-teal-500 p-6 rounded-3xl shadow-2xl space-y-6 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-teal-100 text-[#0E7C86] text-xs font-extrabold px-3 py-1 rounded-full uppercase">⚡ ¡Nuevo Viaje!</span>
              <h4 className="text-3xl font-black text-slate-900 mt-3 font-mono">${oferta.costoEstimado.toFixed(2)}</h4>
            </div>
            <span className="text-sm font-mono font-bold bg-slate-100 px-3 py-1.5 rounded-xl">{oferta.distanciaKm} km</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleResponderOferta("ACEPTADO")} disabled={procesandoAccion} className="flex-1 bg-[#0E7C86] text-white font-extrabold py-4 rounded-2xl flex justify-center gap-2">
              <Check className="w-6 h-6" /> Aceptar
            </button>
            <button onClick={() => handleResponderOferta("RECHAZADO")} disabled={procesandoAccion} className="px-6 bg-rose-50 text-rose-700 font-bold py-4 rounded-2xl">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Estadísticas */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <Wallet className="w-4 h-4 text-[#0E7C86] mb-1" />
          <span className="text-xs font-bold uppercase text-slate-400">Ganancias Hoy</span>
          <span className="text-xl font-black text-slate-900 font-mono">$0.00</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <Route className="w-4 h-4 text-blue-500 mb-1" />
          <span className="text-xs font-bold uppercase text-slate-400">Viajes Listos</span>
          <span className="text-xl font-black text-slate-900 font-mono">0</span>
        </div>
      </div>
    </div>
  );
}