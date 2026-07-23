// src/modules/user/application/use-cases/UpdateDriverAvailabilityUseCase.ts

import { IDriverRepository } from "../ports/IDriverRepository";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";

export class UpdateDriverAvailabilityUseCase {
    
    constructor(private readonly driverRepository: IDriverRepository) {}

    async execute(driverUserId: number, isAvailable: boolean): Promise<void> {
        
        // 1. Buscamos la entidad del chofer
        const driver = await this.driverRepository.findByUserId(driverUserId);
        
        if (!driver) {
            throw new Error("Chofer no encontrado en el sistema.");
        }

        // 2. REGLAS DE NEGOCIO (Decarrerita)
        // Si el chofer intenta encender el radar (isAvailable = true), validamos su aprobación
        if (isAvailable === true) {
            if (!driver.isApproved()) {
                // Bloqueamos la acción si no cumple los requisitos del administrativo
                throw new Error(
                    "Acceso denegado: El radar está bloqueado. El personal administrativo debe aprobar su evaluación psicológica (mínimo 73) y revisión vehicular (mínimo 65)."
                );
            }
        }

        // 3. Si pasa la validación (está aprobado) o simplemente está apagando el radar, se actualiza
        await this.driverRepository.updateAvailability(driverUserId, isAvailable);
    }
}