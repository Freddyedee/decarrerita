import { Vehicle } from "../entities/Vehicle";

/**
 * Puerto (Port) del módulo Vehicle.
 *
 * Define todas las operaciones que el dominio necesita
 * para persistir o consultar vehículos.
 *
 * Ningún caso de uso conocerá Prisma directamente.
 */
export interface IVehicleRepository {

  /**
   * Persiste un nuevo vehículo.
   */
  create(vehicle: Vehicle): Promise<Vehicle>;

  /**
   * Obtiene todos los vehículos registrados.
   */
  findAll(): Promise<Vehicle[]>;

  /**
   * Busca un vehículo por su identificador.
   */
  findById(id: number): Promise<Vehicle | null>;

  /**
   * Busca un vehículo utilizando la placa.
   * La placa es única en el sistema.
   */
  findByPlate(plate: string): Promise<Vehicle | null>;

  
  delete(id: number): Promise<void>;

  /**
   * Actualiza la información del vehículo.
   */

  update(vehicle:Vehicle): Promise <Vehicle>; 

  findByDriverId(driverId: number): Promise<Vehicle[]>;


    /**
   * Todos los vehículos actualmente ACTIVE, sin importar el chofer.
   * Usado por Traslados para determinar qué choferes tienen
   * un vehículo seleccionado y disponible ahora mismo.
   */
  findAllActive(): Promise<Vehicle[]>;


  
}