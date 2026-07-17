// src/middleware.ts

/**
 * TEMPORAL: se desactiva la validación de next-auth mientras
 * ese módulo no tenga datos de prueba reales (ver nota en
 * useCurrentRole.ts). El guard de rol real sigue viviendo en
 * cada layout de grupo — (admin), (cliente), (chofer) — que
 * usa useCurrentRole(), así que las pantallas siguen protegidas
 * a nivel de rol simulado, solo que sin sesión real de por medio.
 */
import { NextResponse } from "next/server";

export default function middleware() {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};