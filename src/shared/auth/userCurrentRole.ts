export type rol = "ADMIN" | "CLIENTE" |"CHOFER"; 


/**
 * MOCK TEMPORAL: simula el usuario autenticado mientras
 * el módulo de Auth de Usuario no está listo. Cuando esté,
 * este archivo se reemplaza por la lectura real de sesión
 * (ej. next-auth, JWT, cookie), sin tocar ninguna página
 * que ya consuma useCurrentRole().
 */
export function useCurrentRole(): { rol: rol; usuarioId: number } {
    return { rol: "ADMIN", usuarioId: 2 }; 
}