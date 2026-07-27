"use client";

import { useState, useEffect } from "react";
import { 
  Car, Plus, Loader2, CheckCircle2, Clock, 
  AlertTriangle, ShieldCheck, Palette, Users, 
  Calendar, Wrench, Tag, XCircle 
} from "lucide-react";

interface Vehiculo {
  id_vehiculo?: number;
  id?: number;
  placa?: string;
  plate?: string;
  modelo?: string;
  model?: string;
  annio?: number;
  year?: number;
  color: string;
  capacidad_pasajeros?: number;
  passengerCapacity?: number;
  estado?: string;
  status?: string;
  observaciones?: string;
}

// Alineado exactamente al resultado de tu curl:
interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
}

const OPCIONES_COLOR = [
  "Blanco", "Negro", "Gris", "Plateado", "Azul", 
  "Rojo", "Verde", "Amarillo", "Beige", "Marrón"
];

export default function ChoferVehiculosClient({ choferId }: { choferId: number }) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados del formulario limpios
  const [brandId, setBrandId] = useState<number | "">("");
  const [modeloNombre, setModeloNombre] = useState<string>("");
  const [placa, setPlaca] = useState("");
  const [año, setAño] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState("Blanco");
  const [capacidad, setCapacidad] = useState("4");

  // 1. Cargar Vehículos del Chofer y Lista de Marcas (Normalizada al curl)
  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      
      const resVehiculos = await fetch(`/api/vehicles/driver/${choferId}?t=${Date.now()}`, { cache: "no-store" });
      if (resVehiculos.ok) {
        const data = await resVehiculos.json();
        setVehiculos(Array.isArray(data) ? data : data.data || []);
      }

      const resMarcas = await fetch(`/api/marcas`, { cache: "no-store" });
      if (resMarcas.ok) {
        const dataMarcas = await resMarcas.json();
        const listaBruta = Array.isArray(dataMarcas) ? dataMarcas : dataMarcas.data || [];
        
        // NORMALIZACIÓN ROBUSTA: Acepta "id" (según tu curl) o "id_marca" por seguridad
        const listaNormalizada: Marca[] = listaBruta.map((m: any, idx: number) => ({
          id: Number(m.id ?? m.id_marca ?? idx + 1),
          nombre: String(m.nombre ?? m.name ?? "Desconocido")
        }));

        setMarcas(listaNormalizada);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (choferId) {
      cargarDatosIniciales();
    }
  }, [choferId]);

  // 2. Cargar Modelos dinámicamente al seleccionar una Marca
  const cargarModelosPorMarca = async (marcaIdParam: number) => {
    try {
      setLoadingModelos(true);
      setModelos([]);
      setModeloNombre("");

      const res = await fetch(`/api/marcas/${marcaIdParam}/modelos`, { cache: "no-store" });
      if (res.ok) {
        const resJson = await res.json();
        const listaBruta = Array.isArray(resJson.data) ? resJson.data : Array.isArray(resJson) ? resJson : [];
        
        // Normalización robusta para modelos
        const listaModelos: Modelo[] = listaBruta.map((mod: any, idx: number) => ({
          id: Number(mod.id ?? mod.id_modelo ?? idx + 1),
          nombre: String(mod.nombre ?? mod.name ?? "Modelo estándar")
        }));

        setModelos(listaModelos);
        
        if (listaModelos.length > 0) {
          setModeloNombre(listaModelos[0].nombre);
        }
      }
    } catch (error) {
      console.error("Error al obtener modelos para marca:", error);
    } finally {
      setLoadingModelos(false);
    }
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrandId = Number(e.target.value);
    setBrandId(selectedBrandId);
    if (selectedBrandId > 0) {
      cargarModelosPorMarca(selectedBrandId);
    } else {
      setModelos([]);
      setModeloNombre("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!brandId || typeof brandId !== "number" || brandId <= 0) {
      setErrorMsg("Por favor seleccione una marca válida.");
      setSubmitting(false);
      return;
    }

    if (!modeloNombre || !modeloNombre.trim()) {
      setErrorMsg("Por favor seleccione un modelo válido.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        driverId: Number(choferId),
        brandId: Number(brandId),
        plate: placa.toUpperCase().trim(),
        model: modeloNombre.trim(),
        year: Number(año),
        color: color.trim(),
        passengerCapacity: Number(capacidad),
      };

      const res = await fetch(`/api/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.error || "Error al registrar el vehículo");
      }

      setSuccessMsg("¡Vehículo registrado con éxito! Ha entrado en cola de revisión técnica.");
      setShowFormModal(false);
      
      setBrandId("");
      setModelos([]);
      setModeloNombre("");
      setPlaca("");
      setAño(String(new Date().getFullYear()));
      setColor("Blanco");
      setCapacidad("4");

      await cargarDatosIniciales();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Car className="w-7 h-7 text-[#0E7C86]" /> Mis Vehículos
          </h1>
          <p className="text-sm text-slate-500">Gestiona tu flota y el estado de revisión técnica</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-[#0E7C86] hover:bg-[#0b626a] text-white font-bold px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Registrar Vehículo
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {/* Lista de Flota */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin mb-3" />
          <p className="text-slate-400 font-medium text-sm">Consultando tu flota...</p>
        </div>
      ) : vehiculos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehiculos.map((v, index) => {
            const idKey = v.id_vehiculo || v.id || `vehiculo-${index}`;
            const placaVehiculo = v.placa || v.plate || "SIN PLACA";
            const modeloVehiculo = v.modelo || v.model || "Vehículo";
            const anioVehiculo = v.annio || v.year || "N/A";
            const capacidadVehiculo = v.capacidad_pasajeros || v.passengerCapacity || 4;
            
            const estadoRaw = (v.estado || v.status || "en_revision").toLowerCase();
            const esActivo = estadoRaw === "activo" || estadoRaw === "active" || estadoRaw === "aprobado";
            const esInactivo = estadoRaw === "inactivo" || estadoRaw === "rechazado";
            const esMantenimiento = estadoRaw === "mantenimiento";

            return (
              <div
                key={idKey}
                className={`bg-white rounded-3xl p-5 border shadow-sm transition-all flex flex-col justify-between ${
                  esActivo ? "border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20" :
                  esInactivo ? "border-rose-200 bg-rose-50/10" : 
                  esMantenimiento ? "border-amber-200 bg-amber-50/10" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 tracking-wider">
                      {placaVehiculo}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      esActivo ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                      esInactivo ? "bg-rose-100 text-rose-800 border border-rose-200" :
                      esMantenimiento ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {esActivo && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {esInactivo && <AlertTriangle className="w-3.5 h-3.5" />}
                      {esMantenimiento && <Wrench className="w-3.5 h-3.5" />}
                      {!esActivo && !esInactivo && !esMantenimiento && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                      
                      {esActivo ? "Activo (Operativo)" : 
                       esInactivo ? "Inactivo / Rechazado" : 
                       esMantenimiento ? "En Mantenimiento" : "En Revisión Técnica"}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mt-1">{modeloVehiculo}</h3>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{anioVehiculo}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-slate-400" />
                      <span className="capitalize">{v.color || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{capacidadVehiculo} pas.</span>
                    </div>
                  </div>
                </div>

                {v.observaciones && (
                  <div className="mt-4 p-2.5 bg-rose-50 rounded-xl text-rose-700 text-xs border border-rose-100 font-medium">
                    ⚠️ {v.observaciones}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Car className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No tienes vehículos registrados</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Para poder recibir solicitudes de traslados, necesitas registrar al menos un vehículo y esperar su aprobación técnica.
          </p>
          <button
            onClick={() => setShowFormModal(true)}
            className="mt-2 bg-[#0E7C86] text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Registrar mi primer auto
          </button>
        </div>
      )}

      {/* MODAL DE REGISTRO (z-[100] para estar siempre sobre el BottomNav) */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0E7C86]" /> Registrar Nuevo Vehículo
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SELECTOR DE MARCA (Usando estrictamente m.id según tu curl) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Marca del Vehículo</label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={brandId}
                    onChange={handleMarcaChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  >
                    <option value="" disabled>Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={`marca-${m.id}`} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SELECTOR DE MODELO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Modelo {loadingModelos && <span className="text-[#0E7C86] font-normal lowercase">(Cargando...)</span>}
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={modeloNombre}
                    onChange={(e) => setModeloNombre(e.target.value)}
                    disabled={!brandId || loadingModelos || modelos.length === 0}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86] disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {!brandId ? (
                      <option value="" disabled>Primero seleccione una marca</option>
                    ) : modelos.length === 0 ? (
                      <option value="" disabled>No hay modelos registrados para esta marca</option>
                    ) : (
                      modelos.map((mod) => (
                        <option key={`mod-${mod.id}`} value={mod.nombre}>
                          {mod.nombre}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* PLACA Y AÑO */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Placa / Matrícula</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="ABC-123"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Año</label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
              </div>

              {/* COLOR Y CAPACIDAD */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  >
                    {OPCIONES_COLOR.map((c) => (
                      <option key={`color-${c}`} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capacidad Pasajeros</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="8"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !brandId || !modeloNombre}
                  className="flex-1 bg-[#0E7C86] hover:bg-[#0b626a] disabled:bg-slate-300 text-white font-bold text-sm py-3 rounded-xl shadow-sm flex justify-center items-center gap-2 transition-all"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Vehículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}