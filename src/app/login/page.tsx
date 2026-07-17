// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ============================================================
 *  BLOQUE DE ESTILOS
 * ============================================================
 * Reutiliza los mismos tokens del resto del panel:
 *   --dispatch: #0E7C86 (acento primario, botón de acción)
 *   --danger:   #C0392B (mensajes de error)
 *   --border:   #E2E4E9 (líneas y bordes)
 * Si cambias la paleta general del proyecto, este es el único
 * archivo de esta pantalla que necesitas tocar para los colores.
 * ============================================================ */

export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /* ========================================================
     * EL LOGIN
     * ========================================================
     * Único punto de conexión con el backend en esta pantalla —
     * llama a POST /api/auth/login (ver route.ts para la lógica
     * real de validación con bcrypt + JWT).
     * ======================================================== */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.message ?? "Credenciales inválidas.");
            } else {
                // La cookie de sesión ya quedó fijada por el propio
                // endpoint (Set-Cookie httpOnly). Redirigimos a una
                // ruta neutral — cada layout de grupo ((admin),
                // (cliente), (chofer)) ya sabe validar el rol real
                // y redirigir si no corresponde a esa pantalla.
                router.push(json.redirectTo);
                router.refresh();
            }
        } catch {
            setError("Error de red al iniciar sesión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#E2E4E9] rounded-lg p-8 w-full max-w-sm flex flex-col gap-5"
            >
                <div>
                    <h1 className="font-display text-2xl tracking-tight text-[#12131A]">
                        Decarrerita
                    </h1>
                    <p className="text-sm text-[#12131A]/60 mt-1">
                        Ingresa con tu correo y contraseña.
                    </p>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[#12131A]/60">Correo electrónico</span>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                        placeholder="tucorreo@ejemplo.com"
                        className="border border-[#E2E4E9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[#12131A]/60">Contraseña</span>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="border border-[#E2E4E9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/40 focus:border-[#0E7C86]"
                    />
                </label>

                {error && (
                    <p className="text-sm text-[#C0392B] bg-[#C0392B]/8 px-3 py-2 rounded">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0E7C86] text-white text-sm font-medium px-4 py-2.5 rounded hover:bg-[#0b636b] transition-colors disabled:opacity-50"
                >
                    {loading ? "Ingresando…" : "Ingresar"}
                </button>
            </form>
        </div>
    );
}