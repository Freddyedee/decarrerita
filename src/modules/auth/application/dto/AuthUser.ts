import { UserRole } from "@modules/user/domain/enums/UserRole";
import { UserStatus } from "@modules/user/domain/enums/UserStatus";

export interface AuthUser {

    id: number;

    email: string;

    role: UserRole;

    status: UserStatus;

}