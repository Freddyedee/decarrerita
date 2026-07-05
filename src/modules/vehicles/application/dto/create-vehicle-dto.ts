export interface CreateVehicleDTO {

  brandId: number; // ID de la marca del vehículo

  driverId: number; // ID del chofer asignado

  plate: string; // Placa del vehículo (única)

  model: string; // Modelo del vehículo

  color: string; // Color del vehículo

  year: number; // Año de fabricación

  passengerCapacity: number; // Capacidad de pasajeros
}