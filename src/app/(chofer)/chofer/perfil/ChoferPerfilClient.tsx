"use client";

import { useState } from "react";
import { UserResponse } from "@/modules/user/application/dto/UserResponse";
import { actualizarPerfilChofer } from "./actions";
import ContactosEmergenciaPanel from "../../EmergencyContacts";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Loader2, 
  CheckCircle2, 
  Lock,
  BadgeCheck,
  Car,
  Contact
} from "lucide-react";

export default function ChoferPerfilClient({ 
  usuario, 
  licenseNumber, 
  approvalStatus 
}: { 
  usuario: UserResponse;
  licenseNumber: string;
  approvalStatus: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const iniciales = `${usuario.firstName.charAt(0)}${usuario.lastName.charAt(0)}`.toUpperCase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await actualizarPerfilChofer(usuario.user_id || 0, usuario.email, formData);

    if (res.success) {
      setFeedback({ type: "success", text: res.message! });
      setIsEditing(false);
    } else {
      setFeedback({ type: "error", text: res.error! });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 pt-16 sm:pt-20">
      
      {/* CABECERA SUPERIOR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0E7C86] to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-md ring-4 ring-teal-50 shrink-0">
            {iniciales}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{usuario.firstName} {usuario.lastName}</h2>
              <BadgeCheck className="w-5 h-5 text-[#0E7C86]" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{usuario.email}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Licencia de Conducir: <span className="font-mono text-slate-800">{licenseNumber || "N/A"}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Estatus de Chofer:</span>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
            approvalStatus === "APROBADO" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}>
            {approvalStatus || "PENDIENTE"}
          </span>
        </div>
      </div>

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0E7C86]" /> Datos Personales
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Manten tu información actualizada para la plataforma.</p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => { setIsEditing(true); setFeedback(null); }}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0E7C86]" /> Editar Datos
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setIsEditing(false); setFeedback(null); }}
              className="inline-flex items-center justify-center gap-1.5 text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                Nombres
              </label>
              <input
                name="firstName"
                type="text"
                required
                disabled={!isEditing}
                defaultValue={usuario.firstName}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium ${
                  isEditing ? "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#0E7C86]/20" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                Apellidos
              </label>
              <input
                name="lastName"
                type="text"
                required
                disabled={!isEditing}
                defaultValue={usuario.lastName}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium ${
                  isEditing ? "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#0E7C86]/20" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Teléfono
              </label>
              <input
                name="phone"
                type="text"
                required
                disabled={!isEditing}
                defaultValue={usuario.phone}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium ${
                  isEditing ? "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#0E7C86]/20" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo Electrónico
              </label>
              <input
                type="email"
                disabled
                defaultValue={usuario.email}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-transparent bg-slate-100 text-slate-500 font-mono cursor-not-allowed select-none"
              />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0E7C86]" /> Contraseña (Confirmar cambios)
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Ingresa tu contraseña actual o nueva"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 bg-white text-slate-900 font-medium"
              />
            </div>
          )}

          {isEditing && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-[#0E7C86] hover:bg-[#0b636b] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>

      {/* SECCIÓN 2: HERRAMIENTAS DEL CHOFER (VEHÍCULOS Y CONTACTOS DE EMERGENCIA) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Contactos de Emergencia */}
        <ContactosEmergenciaPanel choferId={usuario.user_id || 0} />
      </div>

    </div>
  );
}