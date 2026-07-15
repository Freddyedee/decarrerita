import { UserRole } from "@modules/user/domain/enums/UserRole";
import { UserStatus } from "@modules/user/domain/enums/UserStatus";

declare module "next-auth" {

    interface Session {

        user: {

            id: number;

            role: UserRole;

            status: UserStatus;

        } & DefaultSession["user"];

    }

    interface User {

        id: number;

        role: UserRole;

        status: UserStatus;

    }

}

declare module "next-auth/jwt" {

    interface JWT {

        id: number;

        role: UserRole;

        status: UserStatus;

    }

}