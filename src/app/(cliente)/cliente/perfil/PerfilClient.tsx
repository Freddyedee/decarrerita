"use client";

import { useState } from "react";
import { actualizarPerfil } from "./actions";
import { UserResponse } from "@/modules/user/application/dto/UserResponse";
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
  Lock 
} from "lucide-react";

export default function PerfilClient({ usuario }: { usuario: UserResponse }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const iniciales = `${usuario.firstName.charAt(0)}${usuario.lastName.charAt(0)}`.toUpperCase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    
    const res = await actualizarPerfil(
      usuario.user_id || 0,
      usuario.email,
      formData
    );

    if (res.success) {
      setFeedback({ type: "success", text: res.message! });
      setIsEditing(false);
    } else {
      setFeedback({ type: "error", text: res.error! });
    }
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Identidad */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border border-[#E2E4E9] rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0E7C86] to-teal-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-md mb-4 ring-4 ring-teal-50">
            {iniciales}
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            {usuario.firstName} {usuario.lastName}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{usuario.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0E7C86] text-xs font-bold border border-teal-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            CLIENTE VERIFICADO
          </div>

          <div className="w-full border-t border-[#E2E4E9] my-6" />

          <div className="w-full space-y-3 text-left text-xs font-medium text-slate-600">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Estado:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" /> {usuario.status || "ACTIVO"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">ID de Usuario:</span>
              <span className="font-mono text-slate-800">#{usuario.user_id?.toString().padStart(4, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-[#E2E4E9] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E4E9] pb-6 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Información Personal</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Actualiza tu información personal para la plataforma.
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => { setIsEditing(true); setFeedback(null); }}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors border border-slate-200/80"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0E7C86]" /> Editar Datos
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setIsEditing(false); setFeedback(null); }}
                className="inline-flex items-center justify-center gap-1.5 text-rose-600 hover:bg-rose-50 font-semibold text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl text-xs font-medium mb-6 flex items-center gap-2 ${
              feedback.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}>
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0E7C86]" /> Nombres
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  disabled={!isEditing}
                  defaultValue={usuario.firstName}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm border font-medium ${
                    isEditing ? "bg-white border-[#E2E4E9] focus:ring-2 focus:ring-[#0E7C86]/30 text-slate-900" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0E7C86]" /> Apellidos
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  disabled={!isEditing}
                  defaultValue={usuario.lastName}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm border font-medium ${
                    isEditing ? "bg-white border-[#E2E4E9] focus:ring-2 focus:ring-[#0E7C86]/30 text-slate-900" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Teléfono
                </label>
                <input
                  name="phone"
                  type="text"
                  required
                  disabled={!isEditing}
                  defaultValue={usuario.phone}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm border font-medium ${
                    isEditing ? "bg-white border-[#E2E4E9] focus:ring-2 focus:ring-[#0E7C86]/30 text-slate-900" : "bg-slate-50 border-transparent text-slate-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={usuario.email}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-transparent bg-slate-100 text-slate-500 font-mono cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Campo Contraseña (solo visible en modo edición para confirmar o actualizar) */}
            {isEditing && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0E7C86]" /> Contraseña (Confirmación o nueva)
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Ingresa tu contraseña actual o nueva"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-[#E2E4E9] bg-white focus:ring-2 focus:ring-[#0E7C86]/30 text-slate-900 font-medium"
                />
                <p className="text-[11px] text-slate-400 italic">
                  * Requerida por seguridad para confirmar los cambios de tu cuenta.
                </p>
              </div>
            )}

            {isEditing && (
              <div className="pt-4 border-t border-[#E2E4E9] flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-[#0E7C86] hover:bg-[#0b636b] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}