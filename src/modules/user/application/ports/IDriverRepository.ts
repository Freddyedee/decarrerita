import { Driver } from "../../domain/entitites/Driver";
import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";
import { Prisma } from "@prisma/client";

export interface IDriverRepository {

    findByUserId(userId: number): Promise<Driver | null>;

    update(driver: Driver, tx?: Prisma.TransactionClient): Promise<Driver>;

    findPuntajeByChoferId(id: number): Promise<number>;

    updateStatus(driverUserId: number, status: string): Promise<void>;

    updateAvailability(driverUserId: number, isAvailable: boolean): Promise<void>;
    
    create(
        userId: number,
        licenseNumber: DriverLicense,
        status: ApprovalStatus,
        bankId: number | null, // <-- Añadimos el banco a la firma de creación
        tx?: Prisma.TransactionClient
    ): Promise<Driver>;

}