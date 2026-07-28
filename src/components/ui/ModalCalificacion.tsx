"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. IMPORTAMOS EL PORTAL DE REACT
import { Star, Loader2, MessageSquare, CheckCircle2, ShieldAlert } from "lucide-react";

interface ModalCalificacionProps {
  trasladoId: number;
  calificadorEsCliente: boolean; // true = Cliente califica al Chofer; false = Chofer al Cliente
  onClose: () => void; // Función que se ejecuta al terminar de calificar
}

export default function ModalCalificacion({
  trasladoId,
  calificadorEsCliente,
  onClose,
}: ModalCalificacionProps) {
  const [puntuacion, setPuntuacion] = useState<number>(5);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [exito, setExito] = useState<boolean>(false);

  // 2. ESTADO PARA EVITAR ERRORES DE HYDRATION EN NEXT.JS (SSR)
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/traslados/${trasladoId}/calificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calificadorEsCliente,
          puntuacion,
          comentario: comentario.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error al enviar la calificación.");
      }

      setExito(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("❌ [ERROR CALIFICANDO]:", err);
      setError(err.message || "No se pudo registrar la calificación.");
    } finally {
      setLoading(false);
    }
  };

  // Si no se ha montado en el cliente aún, no renderizamos el portal
  if (!mounted) return null;

  // 3. ENVOLVEMOS TODO EL MODAL CON createPortal HACIA EL document.body
  return createPortal(
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-6 relative z-[100000]">
        
        {/* Encabezado */}
        <div className="space-y-1">
          <span className="bg-[#0E7C86]/10 text-[#0E7C86] text-[11px] font-black uppercase px-3 py-1 rounded-full font-mono">
            Traslado Finalizado #{trasladoId}
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            {calificadorEsCliente ? "¿Cómo estuvo tu viaje?" : "¿Cómo estuvo el cliente?"}
          </h3>
          <p className="text-xs text-slate-500">
            {calificadorEsCliente
              ? "Tu evaluación nos ayuda a mantener choferes de excelente calidad."
              : "Califica el comportamiento y puntualidad del pasajero."}
          </p>
        </div>

        {exito ? (
          <div className="py-8 space-y-3 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800 text-lg">¡Calificación Registrada!</p>
            <p className="text-xs text-slate-400">Gracias por ayudar a mejorar la comunidad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Sistema Interactivo de 5 Estrellas */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = (hoverStar || puntuacion) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPuntuacion(star)}
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        isSelected
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "fill-slate-100 text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-black uppercase tracking-wider text-amber-600">
              {puntuacion === 5 && "⭐ ¡Excelente Servicio!"}
              {puntuacion === 4 && "👍 Muy Bueno"}
              {puntuacion === 3 && "😐 Regular / Aceptable"}
              {puntuacion === 2 && "⚠️ Deficiente"}
              {puntuacion === 1 && "🚫 Muy Mala Experiencia"}
            </div>

            {/* Campo de Comentario */}
            <div className="text-left space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Comentario (Opcional)</span>
              </label>
              <textarea
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder={
                  calificadorEsCliente
                    ? "El vehículo estaba limpio, el chofer fue muy amable..."
                    : "El pasajero estaba listo a tiempo, excelente trato..."
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#0E7C86] focus:outline-none resize-none"
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-xs font-medium text-left">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E7C86] hover:bg-[#095259] disabled:bg-slate-300 text-white font-extrabold py-3.5 rounded-2xl shadow-md flex justify-center items-center gap-2 text-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando evaluación...
                </>
              ) : (
                "Enviar Calificación"
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body // <-- AQUÍ OCURRE LA MAGIA DEL TELETRANSPORTE
  );
}