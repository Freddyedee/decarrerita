import { prisma  }       from "@/shared/lib/prisma";
import { Vehicle }       from "../../domain/entities/Vehicle";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { vehicleMapper } from "../mappers/vehicle.mapper";
import { VehicleStatus } from "../../domain/enum/VehicleStatus";

export class VehicleRepository implements IVehicleRepository {

    /**
     * Crea un nuevo vehículo.
     */
    async create(vehicle: Vehicle): Promise<Vehicle> {

        const { id_vehiculo, ...data } = vehicleMapper.toPersistence(vehicle);

        const created = await prisma.vehiculo.create({
            data
        });

        return vehicleMapper.toDomain(created);
    }

    /**
     * Busca un vehículo por su identificador.
     */
    async findById(id: number): Promise<Vehicle | null> {

        const vehicle = await prisma.vehiculo.findUnique({
            where: { id_vehiculo: id }
        });

        if (!vehicle) {
            return null;
        }

        return vehicleMapper.toDomain(vehicle);
    }

    /**
     * Obtiene todos los vehículos registrados.
     */
    async findAll(): Promise<Vehicle[]> {

        const vehicles = await prisma.vehiculo.findMany({
            orderBy: { id_vehiculo: "asc" }
        });

        return vehicles.map(vehicle => vehicleMapper.toDomain(vehicle));
    }

    /**
     * Busca un vehículo utilizando su placa.
     */
    async findByPlate(plate: string): Promise<Vehicle | null> {

        const vehicle = await prisma.vehiculo.findUnique({
            where: { placa: plate }
        });

        if (!vehicle) {
            return null;
        }

        return vehicleMapper.toDomain(vehicle);
    }

    /**
     * Busca todos los vehículos pertenecientes a un chofer.
     *
     * Un chofer puede tener varios vehículos registrados.
     */
    async findByDriverId(driverId: number): Promise<Vehicle[]> {

        const vehicles = await prisma.vehiculo.findMany({
            where: { id_chofer: driverId },
            orderBy: { id_vehiculo: "asc" }
        });

        return vehicles.map(vehicle => vehicleMapper.toDomain(vehicle));
    }

    /**
     * Actualiza la información completa del vehículo
     * a partir del estado actual de la Entity de dominio.
     *
     * Se utiliza, por ejemplo, cuando la Entity cambia su
     * propio estado (activate, desactivate, sendToMaintenance, etc.)
     * y ese cambio debe reflejarse en la base de datos.
     */
    async update(vehicle: Vehicle): Promise<Vehicle> {

        const { id_vehiculo, ...data } = vehicleMapper.toPersistence(vehicle);

        const updated = await prisma.vehiculo.update({
            where: { id_vehiculo: vehicle.id },
            data
        });

        return vehicleMapper.toDomain(updated);
    }

    /**
     * Elimina físicamente un vehículo.
     *
     * En producción probablemente esta operación será
     * reemplazada por un borrado lógico.
     */
    async delete(id: number): Promise<void> {

        await prisma.vehiculo.delete({
            where: { id_vehiculo: id }
        });
    }

    async findAllActive(): Promise<Vehicle[]> {

        const vehicles = await prisma.vehiculo.findMany({
            where: { estado: VehicleStatus.ACTIVE }
        });

        return vehicles.map(v => vehicleMapper.toDomain(v));
        
    }
}