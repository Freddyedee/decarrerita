"use client";

import { useState, useEffect } from "react";
import { Phone, Plus, Loader2 } from "lucide-react";

interface Contacto { id: number; contactName: string; relationship: string; phone: string; }

export default function ContactosEmergenciaPanel({ choferId }: { choferId: number }) {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [nombre, setNombre] = useState(""); const [relacion, setRelationship] = useState(""); const [telefono, setPhone] = useState("");

  const cargarContactos = async () => {
    try {
      const res = await fetch(`/api/drivers/${choferId}/emergencyContact?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setContactos(Array.isArray(data) ? data : (data.data || []));
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarContactos(); }, [choferId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch(`/api/drivers/${choferId}/emergencyContact`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactName: nombre, relationship: relacion, phone: telefono }),
      });
      if (!res.ok) throw new Error("Error al agregar contacto");
      setShowForm(false); setNombre(""); setRelationship(""); setPhone("");
      cargarContactos();
    } catch (err: any) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Phone className="w-5 h-5 text-rose-600" /> Contactos de Emergencia</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
          <Plus className="w-4 h-4 text-rose-600" /> {showForm ? "Cerrar" : "Añadir Contacto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div><label className="font-bold">Nombre Completo</label><input required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="María Pérez" className="w-full p-2 border rounded-lg mt-1" /></div>
            <div><label className="font-bold">Parentesco</label><input required value={relacion} onChange={e => setRelationship(e.target.value)} placeholder="Madre / Esposa" className="w-full p-2 border rounded-lg mt-1" /></div>
            <div><label className="font-bold">Teléfono</label><input required value={telefono} onChange={e => setPhone(e.target.value)} placeholder="0414-1234567" className="w-full p-2 border rounded-lg mt-1" /></div>
          </div>
          <button disabled={submitting} type="submit" className="w-full bg-rose-600 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Contacto"}
          </button>
        </form>
      )}

      {loading ? <p className="text-xs text-slate-400">Cargando contactos...</p> : (
        <div className="space-y-3">
          {contactos.map(c => (
            <div key={c.id} className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-left">
              <div>
                <p className="font-bold text-sm text-slate-800">{c.contactName}</p>
                <p className="text-xs text-slate-500">{c.relationship} • font-mono: {c.phone}</p>
              </div>
            </div>
          ))}
          {contactos.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No has registrado contactos de emergencia.</p>}
        </div>
      )}
    </div>
  );
}