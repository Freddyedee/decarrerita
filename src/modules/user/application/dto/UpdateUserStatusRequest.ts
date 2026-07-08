import { UserStatus } from "../../domain/enums/UserStatus";

export interface UpdateUserStatusRequest {

    userId: number;

    status: string;

}