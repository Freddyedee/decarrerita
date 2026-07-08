import { UserStatus } from "../../domain/enums/UserStatus";

export interface UpdateUserStatusResponse {

    userId: number;

    status: string;

    updatedAt: Date;

}