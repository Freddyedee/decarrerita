import { UserRole } from "../../domain/enums/UserRole";
import { UserStatus } from "../../domain/enums/UserStatus";
import { PersonName, Phone, Email } from "../../domain/value-objects";

export interface GetUserResponse {
    user_id: number;
    role: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: Date;
}