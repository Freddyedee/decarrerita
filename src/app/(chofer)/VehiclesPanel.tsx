"use client";

import { useState, useEffect } from "react";
import { Car, Plus, Loader2 } from "lucide-react";

interface Vehiculo {
  id: number; plate: string; model: string; year: number;
  color: string; passengerCapacity: number; status?: string;
}

export default function VehiclesPanel({ choferId }: { choferId: number }) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [placa, setPlaca] = useState(""); const [modelo, setModelo] = useState("");
  const [año, setAño] = useState("2022"); const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("4");

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(`/api/vehicles/driver/${choferId}?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setVehiculos(Array.isArray(data) ? data : (data.data || []));
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarVehiculos(); }, [choferId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch(`/api/vehicles`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: choferId, plate: placa, model: modelo, year: Number(año), color, passengerCapacity: Number(capacidad), brandId: 1 }),
      });
      if (!res.ok) throw new Error("Error al registrar vehículo");
      setShowForm(false); setPlaca(""); setModelo(""); setColor("");
      cargarVehiculos();
    } catch (err: any) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Car className="w-5 h-5 text-[#0E7C86]" /> Mis Vehículos</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
          <Plus className="w-4 h-4 text-[#0E7C86]" /> {showForm ? "Cerrar" : "Añadir Vehículo"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><label className="font-bold">Placa</label><input required value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC-123" className="w-full p-2 border rounded-lg mt-1" /></div>
            <div><label className="font-bold">Modelo</label><input required value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Corolla" className="w-full p-2 border rounded-lg mt-1" /></div>
            <div><label className="font-bold">Año</label><input required type="number" value={año} onChange={e => setAño(e.target.value)} className="w-full p-2 border rounded-lg mt-1" /></div>
            <div><label className="font-bold">Color</label><input required value={color} onChange={e => setColor(e.target.value)} placeholder="Blanco" className="w-full p-2 border rounded-lg mt-1" /></div>
          </div>
          <button disabled={submitting} type="submit" className="w-full bg-[#0E7C86] text-white font-bold py-2.5 rounded-lg text-xs flex justify-center">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Vehículo"}
          </button>
        </form>
      )}

      {loading ? <p className="text-xs text-slate-400">Cargando vehículos...</p> : (
        <div className="space-y-3">
          {vehiculos.map(v => (
            <div key={v.id} className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-left">
              <div>
                <p className="font-bold text-sm text-slate-800">{v.model} ({v.year})</p>
                <p className="text-xs text-slate-500 font-mono">Placa: {v.plate} | Color: {v.color || "N/A"}</p>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase ${(v.status || "").toUpperCase() === "APROBADO" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {v.status || "EN REVISIÓN"}
              </span>
            </div>
          ))}
          {vehiculos.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No tienes vehículos registrados.</p>}
        </div>
      )}
    </div>
  );
}