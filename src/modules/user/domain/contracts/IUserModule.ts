import { UserRole } from "../enums/UserRole";
import { UserStatus } from "../enums/UserStatus";


export interface IUserModule {
    exists(userId: string): Promise<boolean>;

    isActive(userId: string): Promise<boolean>;

    isDriver(userId: string): Promise<boolean>;

    isClient(userId: string): Promise<boolean>;

    getUserRole(userId: string): Promise<UserRole>;

    updateDriverAverageRating(
        userId: string,
        averageRating: number
    ): Promise<void>;

    updateClientAverageRating(
        userId: string,
        averageRating: number
    ): Promise<void>;

    incrementCompletedTrips(
        userId: string
    ): Promise<void>;

    changeUserStatus(
        userId: string,
        status: UserStatus
    ): Promise<void>;

    ///////////////////////////////////////////////////////
}