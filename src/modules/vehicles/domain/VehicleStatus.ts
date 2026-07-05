/**
 * Evitamos strings suelto sen el codigo al referirnos a los estados del vehículo.
 */

export enum VehicleStatus {
    ACTIVE = 'activo', 
    INACTIVE = 'inactivo',
    REVISION = 'en_revision', 
    MAINTENANCE = 'mantenimiento'
}