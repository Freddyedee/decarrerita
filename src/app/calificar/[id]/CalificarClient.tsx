"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, MessageSquare, CheckCircle2, ShieldAlert, ArrowLeft } from "lucide-react";

interface CalificarClientProps {
  trasladoId: number;
  calificadorEsCliente: boolean;
  rolUsuario: string;
}

export default function CalificarClient({
  trasladoId,
  calificadorEsCliente,
  rolUsuario,
}: CalificarClientProps) {
  const router = useRouter();
  const [puntuacion, setPuntuacion] = useState<number>(5);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [exito, setExito] = useState<boolean>(false);

  // Ruta de regreso segura según el rol
  const rutaRegreso = rolUsuario === "CLIENTE" ? "/cliente" : "/chofer";

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
      
      // Tras 1.5 segundos, lo devolvemos automáticamente a su Dashboard
      setTimeout(() => {
        router.push(rutaRegreso);
        router.refresh(); // Refrescamos para limpiar el estado del servidor
      }, 1500);
    } catch (err: any) {
      console.error("❌ [ERROR CALIFICANDO]:", err);
      setError(err.message || "No se pudo registrar la calificación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 text-center space-y-6 animate-in fade-in duration-300">
      
      {/* Botón superior de regresar (Por si quiere salir sin calificar) */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => router.push(rutaRegreso)}
          disabled={loading || exito}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al panel</span>
        </button>
      </div>

      {/* Encabezado */}
      <div className="space-y-1">
        <span className="bg-[#0E7C86]/10 text-[#0E7C86] text-xs font-black uppercase px-3 py-1 rounded-full font-mono">
          Traslado Finalizado #{trasladoId}
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-2">
          {calificadorEsCliente ? "¿Cómo estuvo tu viaje?" : "¿Cómo se comportó el cliente?"}
        </h1>
        <p className="text-sm text-slate-500">
          {calificadorEsCliente
            ? "Tu evaluación nos ayuda a mantener choferes de excelente calidad."
            : "Califica el comportamiento, respeto y puntualidad del pasajero."}
        </p>
      </div>

      {exito ? (
        <div className="py-8 space-y-3 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="font-bold text-slate-800 text-xl">¡Calificación Registrada!</h2>
          <p className="text-xs text-slate-400">Redirigiendo a tu panel principal...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
                    className={`w-11 h-11 transition-colors ${
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
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Comentario o sugerencia (Opcional)</span>
            </label>
            <textarea
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder={
                calificadorEsCliente
                  ? "El vehículo estaba impecable, el chofer fue muy amable..."
                  : "El pasajero estaba listo a tiempo, excelente trato..."
              }
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#0E7C86] focus:outline-none resize-none font-medium"
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-medium text-left">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E7C86] hover:bg-[#095259] disabled:bg-slate-300 text-white font-extrabold py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 text-sm transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Enviar Calificación"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push(rutaRegreso)}
              disabled={loading}
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 py-2.5 transition-colors block"
            >
              Saltar y calificar más tarde
            </button>
          </div>
        </form>
      )}
    </div>
  );
}