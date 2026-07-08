/** Archivo cuya principal funcion se basa en funcionar como:
 *  puente entre Prisma Model (Base de datos) <-> Domain Entity (Dominio - Domain) */

import { Vehicle }                   from "../../domain/entities/Vehicle";
import { VehicleStatus }             from "../../domain/enum/VehicleStatus";
import { vehiculo as PrismaVehicle } from "@prisma/client";

export class vehicleMapper {

    // Prisma -> Domain

    static toDomain(raw: PrismaVehicle):Vehicle {

        return new Vehicle(

            raw.id_vehiculo, 
            raw.id_marca,
            raw.id_chofer, 
            raw.placa, 
            raw.modelo, 
            raw.color, 
            raw.annio,
            raw.capacidad_pasajeros,
            raw.fecha_registro, 
            this.mapStatus(raw.estado),
        );
    }

    // Dominio -> prisma 

    static toPersistence (Vehicle: Vehicle){

        return {
            id_vehiculo:         Vehicle.id, 
            id_marca:            Vehicle.brandId, 
            id_chofer:           Vehicle.driverId, 
            placa:               Vehicle.plate, 
            modelo:              Vehicle.model, 
            color:               Vehicle.color, 
            annio:               Vehicle.year, 
            capacidad_pasajeros: Vehicle.passengerCapacity, 
            fecha_registro:      Vehicle.createdAt,
            estado:              Vehicle.status, 
        }; 
    }

    // Normalizador de estados

    private static mapStatus(status: string): VehicleStatus{

        switch(status){ 

            case 'activo':        return VehicleStatus.ACTIVE; 
            case 'inactivo':      return VehicleStatus.INACTIVE; 
            case 'en_revision':   return VehicleStatus.REVISION;
            case 'mantenimiento': return VehicleStatus.MAINTENANCE; 
            default:              return VehicleStatus.INACTIVE

        }
    }
}
