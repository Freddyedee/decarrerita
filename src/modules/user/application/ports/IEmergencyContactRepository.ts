import { EmergencyContact } from "../../domain/entitites/EmergencyContact";

export interface IEmergencyContactRepository {

    /**
     * Crea un nuevo contacto de emergencia para un chofer.
     * No requiere transacción compartida con otras operaciones
     * (a diferencia de la creación de usuario/chofer): agregar
     * un contacto es una operación independiente que un chofer
     * ya existente hace en cualquier momento después de
     * registrarse.
     */
    create(contact: EmergencyContact): Promise<EmergencyContact>;

    findByDriverUserId(driverUserId: number): Promise<EmergencyContact[]>;

    /**
     * RN-028: cuenta SOLO los contactos ACTIVOS de un chofer.
     * UpdateDriverStatusUseCase usa este número (no la lista
     * completa) para decidir si el chofer puede pasar a
     * APROBADO — separarlo en su propio método evita traer toda
     * la lista solo para contarla, y deja explícito en la firma
     * que la regla de negocio (mínimo 2) mira contactos activos,
     * no el total histórico.
     */
    countActiveByDriverUserId(driverUserId: number): Promise<number>;

}