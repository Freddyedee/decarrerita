export interface CreateUserRequest {
    role: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;

    /**
     * RN-026/RN-027: obligatorio SOLO cuando `role` es DRIVER
     * (ver UserRole). CreateUserUseCase valida esto en tiempo de
     * ejecución (no se puede expresar como campo condicional en
     * una interfaz de TypeScript) y lanza error si falta.
     * Se ignora para cualquier otro rol.
     */
    licenseNumber?: string;
}