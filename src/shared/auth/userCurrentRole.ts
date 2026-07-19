// src/shared/auth/useCurrentRole.ts

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type Rol = "ADMIN" | "CLIENTE" | "CHOFER";

export interface SesionActual {
    rol: Rol;
    usuarioId: number;
}

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

/**
 * ============================================================
 * MAPEO REAL — según la tabla `rol` de Postgres, NO según el
 * enum UserRole del módulo Usuario.
 * ============================================================
 *
 * PrismaUserRepository.toDomain() hace `user.id_rol as UserRole`
 * — un cast de TypeScript sin traducción real. El número que
 * circula en toda la app (incluido el JWT de esta sesión) es
 * literalmente el id_rol crudo de la tabla `rol`:
 *
 *   1 = Administrador
 *   2 = Cliente
 *   3 = Chofer
 *
 * ============================================================
 */
function mapIdRolToRol(idRol: number): Rol {
    switch (idRol) {
        case 1: return "ADMIN";
        case 2: return "CLIENTE";
        case 3: return "CHOFER";
        default: throw new Error(`Unknown id_rol: ${idRol}`);
    }
}

export async function useCurrentRole(): Promise<SesionActual | null> {

    const token = cookies().get("session_token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret);
        return {
            rol: mapIdRolToRol(Number(payload.role)),
            usuarioId: Number(payload.userId)
        };
    } catch {
        return null;
    }
}