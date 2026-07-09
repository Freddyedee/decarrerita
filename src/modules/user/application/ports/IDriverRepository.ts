import { Driver } from "../../domain/entitites/Driver";

export interface IDriverRepository {

    findByUserId(userId: number): Promise<Driver | null>;

    update(driver: Driver): Promise<Driver>;

    findPuntajeByChoferId(id: number): Promise<Driver>; // hice la friam del metood para que no gneerara erorres pero falta la implementacion del mismo. 

}