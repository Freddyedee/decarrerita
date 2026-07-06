/**
 * DTO utilizado para enviar información
 * del vehículo hacia el exterior (Frontend/API).
 *
 * Nunca exponemos directamente la entidad Vehicle.
 */
export interface VehicleResponseDTO {

    id: number;

    brandId: number;

    driverId: number;

    plate: string;

    model: string;

    color: string;

    year: number;

    passengerCapacity: number;

    createdAt: Date;
    
    status: string;

}