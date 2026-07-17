// src/shared/auth/useCurrentRole.ts

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserRole } from "@modules/user/domain/enums/UserRole";

/**
 * ============================================================
 * SESIÓN REAL — lee y verifica el JWT propio (ver
 * /api/auth/login/route.ts). Reemplaza tanto el mock de
 * cookies manuales como la integración de next-auth.
 * ============================================================
 */

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export type Rol = "ADMIN" | "STAFF" | "CLIENTE" | "CHOFER";

export interface SesionActual {
    rol: Rol;
    usuarioId: number;
}

/**
 * Único punto de mapeo entre el enum numérico UserRole (del
 * módulo Usuario) y los strings que usa el frontend. Si el
 * enum cambia de valores, solo se ajusta aquí.
 */
function mapUserRoleToRol(role: UserRole): Rol {
    switch (role) {
        case UserRole.ADMIN:  return "ADMIN";
        case UserRole.STAFF:  return "STAFF";
        case UserRole.CLIENT: return "CLIENTE";
        case UserRole.DRIVER: return "CHOFER";
    }
}

export async function useCurrentRole(): Promise<SesionActual | null> {

    const token = cookies().get("session_token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret);
        return {
            rol: mapUserRoleToRol(payload.role as UserRole),
            usuarioId: Number(payload.userId)
        };
    } catch {
        return null; // token inválido, expirado, o manipulado
    }
}