import { PersonName } from "../value-objects/PersonName";
import { Phone } from "../value-objects/Phone";

/**
 * ============================================================
 * Entity: EmergencyContact
 * ============================================================
 *
 * Representa un contacto de emergencia declarado por un chofer.
 *
 * RN-028: todo chofer debe tener AL MENOS 2 contactos de
 * emergencia ACTIVOS antes de poder ser aprobado (ver
 * UpdateDriverStatusUseCase, que es quien realmente hace
 * cumplir esta regla al momento de aprobar). Esta entidad no
 * conoce ese mínimo — solo modela un contacto individual y su
 * ciclo de vida (activo/inactivo). Contar y validar el mínimo
 * es responsabilidad del UseCase, que sí tiene visión de TODOS
 * los contactos de un chofer.
 *
 * Un contacto "inactivo" (desactivar() ) no se borra de la
 * base de datos — se conserva para trazabilidad/auditoría, pero
 * deja de contar para el mínimo requerido de 2.
 *
 * ============================================================
 */
export class EmergencyContact {

    constructor(
        public readonly id: number | null,
        public readonly driverUserId: number,
        private contactName: PersonName,
        private relationship: string,
        private phone: Phone,
        private active: boolean
    ) {

        this.validateRelationship(relationship);

    }

    // ============================================================
    // VALIDACIÓN
    // ============================================================

    /**
     * El parentesco es texto libre corto (ej. "Madre", "Hermano",
     * "Cónyuge") — no se modela como enum porque la empresa no
     * quiere restringir cómo el chofer describe la relación.
     */
    private validateRelationship(relationship: string): void {

        const normalized = relationship.trim();

        if (normalized.length === 0) {
            throw new Error("Relationship cannot be empty.");
        }

        if (normalized.length > 50) {
            throw new Error("Relationship is too long.");
        }

    }

    // ============================================================
    // COMPORTAMIENTO
    // ============================================================

    /**
     * Un contacto dado de baja deja de contar para el mínimo de 2
     * (RN-028), pero se conserva en el historial en vez de
     * eliminarse — igual que las bajas lógicas del resto del
     * sistema (ej. banco.activo).
     */
    desactivar(): void {
        this.active = false;
    }

    reactivar(): void {
        this.active = true;
    }

    estaActivo(): boolean {
        return this.active;
    }

    updateContactInfo(contactName: PersonName, relationship: string, phone: Phone): void {

        this.validateRelationship(relationship);

        this.contactName = contactName;
        this.relationship = relationship;
        this.phone = phone;

    }

    // ============================================================
    // GETTERS
    // ============================================================

    getContactName(): PersonName {
        return this.contactName;
    }

    getRelationship(): string {
        return this.relationship;
    }

    getPhone(): Phone {
        return this.phone;
    }

}