// En: src/modules/user/application/dto/CreateUserRequest.ts
export interface CreateUserRequest {
    role: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string; // <-- CAMBIO: Recibe la contraseña en texto plano

    /**
     * RN-026/RN-027: obligatorio SOLO cuando `role` es DRIVER.
     */
    licenseNumber?: string;

    /**
     * ID del Banco asignado al chofer. Opcional en el registro inicial.
     */
    bankId?: number;
}