import { Driver } from "../../domain/entitites/Driver";

export interface IDriverRepository {

    findByUserId(userId: number): Promise<Driver | null>;

    update(driver: Driver): Promise<Driver>;

    findPuntajeByChoferId(id: number): Promise<Driver>; 

    updateStatus(driverUserId: number, status: string): Promise<void>;


}