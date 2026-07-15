import { AuthController } from "../presentation/AuthController";

import { LoginUseCase } from "../application/usecases/LoginUseCase";
import { LogoutUseCase } from "../application/usecases/LogoutUseCase";

import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher";

import { PrismaUserRepository } from "@modules/user/infrastructure/repositories/PrismaUserRepository";
import { prisma } from "@/shared/lib/prisma";

export class AuthContainer {

    private static authController: AuthController;

    static getAuthController(): AuthController {

        if (!this.authController) {

            const userRepository = new PrismaUserRepository(prisma);

            const passwordHasher = new BcryptPasswordHasher();

            const loginUseCase = new LoginUseCase(
                userRepository,
                passwordHasher
            );

            const logoutUseCase = new LogoutUseCase();

            this.authController = new AuthController(
                loginUseCase,
                logoutUseCase
            );

        }

        return this.authController;

    }

}