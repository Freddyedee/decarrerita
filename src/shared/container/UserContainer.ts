

import { PrismaUserRepository } from "../../modules/user/infrastructure/repositories/PrismaUserRepository";
import { PrismaClientRepository } from "../../modules/user/infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "../../modules/user/infrastructure/repositories/PrismaDriverRepository";
import { PrismaPsychologicalEvaluationRepository } from "../../modules/user/infrastructure/repositories/PrismaPsychologicalEvaluationRepository";

import { CreateUserUseCase } from "../../modules/user/application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../modules/user/application/use-cases/GetUserByIdUseCase";
import { UpdateUserProfileUseCase } from "../../modules/user/application/use-cases/UpdateUserProfileUseCase";
import { UpdateUserStatusUseCase } from "../../modules/user/application/use-cases/UpdateUserStatusUseCase";

import { UpdateClientRatingUseCase } from "../../modules/user/application/use-cases/UpdateClientRatingUseCase";

import { UpdateDriverMetricsUseCase } from "../../modules/user/application/use-cases/UpdateDriverMetricsUseCase";
import { UpdateDriverStatusUseCase } from "../../modules/user/application/use-cases/UpdateDriverStatusUseCase";
import { UpdateDriverLicenseUseCase } from "../../modules/user/application/use-cases/UpdateDriverLicenseUseCase";

import { RegisterPsychologicalEvaluationUseCase } from "../../modules/user/application/use-cases/RegisterPsychologicalEvaluationUseCase";
import { GetPsychologicalEvaluationsUseCase } from "../../modules/user/application/use-cases/GetPsychologicalEvaluationsUseCase";

import { UserController } from "../../modules/user/presentation/controllers/UserController";
import { ClientController } from "../../modules/user/presentation/controllers/ClientController";
import { DriverController } from "../../modules/user/presentation/controllers/DriverController";
import { PsychologicalEvaluationController } from "../../modules/user/presentation/controllers/PsychologicalEvaluationController";
import { prisma } from "../lib/prisma";


export class UserContainer {

    // ============================
    // Repositories
    // ============================

    private static readonly userRepository =
        new PrismaUserRepository(prisma);

    private static readonly clientRepository =
        new PrismaClientRepository(prisma);

    private static readonly driverRepository =
        new PrismaDriverRepository(prisma);

    private static readonly psychologicalEvaluationRepository =
        new PrismaPsychologicalEvaluationRepository(prisma);

    // ============================
    // User Use Cases
    // ============================

    private static readonly createUserUseCase =
        new CreateUserUseCase(
            this.userRepository
        );

    private static readonly getUserByIdUseCase =
        new GetUserByIdUseCase(
            this.userRepository
        );

    private static readonly updateUserProfileUseCase =
        new UpdateUserProfileUseCase(
            this.userRepository
        );

    private static readonly updateUserStatusUseCase =
        new UpdateUserStatusUseCase(
            this.userRepository
        );

    // ============================
    // Client Use Cases
    // ============================

    private static readonly updateClientRatingUseCase =
        new UpdateClientRatingUseCase(
            this.clientRepository
        );

    // ============================
    // Driver Use Cases
    // ============================

    private static readonly updateDriverMetricsUseCase =
        new UpdateDriverMetricsUseCase(
            this.driverRepository
        );

    private static readonly updateDriverStatusUseCase =
        new UpdateDriverStatusUseCase(
            this.driverRepository
        );

    private static readonly updateDriverLicenseUseCase =
        new UpdateDriverLicenseUseCase(
            this.driverRepository
        );

    // ============================
    // Psychological Evaluation
    // ============================

    private static readonly registerPsychologicalEvaluationUseCase =
        new RegisterPsychologicalEvaluationUseCase(
            this.driverRepository,
            this.psychologicalEvaluationRepository
        );

    private static readonly getPsychologicalEvaluationsUseCase =
        new GetPsychologicalEvaluationsUseCase(
            this.psychologicalEvaluationRepository
        );

    // ============================
    // Controllers
    // ============================

    static readonly userController =
        new UserController(
            this.createUserUseCase,
            this.getUserByIdUseCase,
            this.updateUserProfileUseCase,
            this.updateUserStatusUseCase
        );

    static readonly clientController =
        new ClientController(
            this.updateClientRatingUseCase
        );

    static readonly driverController =
        new DriverController(
            this.updateDriverMetricsUseCase,
            this.updateDriverStatusUseCase,
            this.updateDriverLicenseUseCase
        );

    static readonly psychologicalEvaluationController =
        new PsychologicalEvaluationController(
            this.registerPsychologicalEvaluationUseCase,
            this.getPsychologicalEvaluationsUseCase
        );

}