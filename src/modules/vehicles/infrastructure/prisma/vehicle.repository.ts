import { prisma  }       from "@/infra/prisma/client";
import { vehicleMapper } from "../mappers/vehicle.mapper";
import { Vehicle }       from "../../domain/Vehicle";


export class VehicleRepository { 

    /**En esta clase definiremos los metodos CRUD para lograr un flujo de datos con los vehiculos. */

    //CREATE 

    async create (vehicle: Vehicle): Promise <Vehicle> { 
        const data = vehicleMapper.toPersistence(vehicle); 

        const created = await prisma.vehiculo.create({data}); 

        return vehicleMapper.toDomain(created); 
    }

    // Find by id (Buscar por Id)

    async findById(id:number): Promise<Vehicle | null>{

        const vehicle = await prisma.vehiculo.findUnique({ where: {id_vehiculo:id}}); 

        if (!vehicle) return null; 

        return vehicleMapper.toDomain(vehicle);
    }

    //LIST ALL

    async findAll(): Promise<Vehicle[]> {
        const vehicles = await prisma.vehiculo.findMany(); 

        return vehicles.map(vehicleMapper.toDomain); 
    }

    //UPDATE STATUS 

    async updateStatus(id: number, status: string): Promise <Vehicle> {

        const updated = await prisma.vehiculo.update({

            where: { id_vehiculo: id}, 
            data : {estado: status}

        }); 
   
        return vehicleMapper.toDomain(updated); 
    }


    // DELETE 

    async delete (id: number): Promise <void> {

        await prisma.vehiculo.delete({
            
            where: { id_vehiculo: id}
        }); 
    }

    async findByPlate(plate: string) {

        return prisma.vehiculo.findUnique({
        
            where: { placa: plate }
        });
    }


}
