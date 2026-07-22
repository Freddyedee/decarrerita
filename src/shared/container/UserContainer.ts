// src/modules/user/infrastructure/UserContainer.ts

import { PrismaUserRepository } from "../../modules/user/infrastructure/repositories/PrismaUserRepository";
import { PrismaClientRepository } from "../../modules/user/infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "../../modules/user/infrastructure/repositories/PrismaDriverRepository";
import { PrismaPsychologicalEvaluationRepository } from "../../modules/user/infrastructure/repositories/PrismaPsychologicalEvaluationRepository";
import { PrismaEmergencyContactRepository } from "../../modules/user/infrastructure/repositories/PrismaEmergencyContactRepository";

// IMPORTANTE: Importamos el repositorio de bancos
import { BancoRepository } from "@/modules/banco/infrastructure/prisma/BancoRepository";

import { CreateUserUseCase } from "../../modules/user/application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../modules/user/application/use-cases/GetUserByIdUseCase";
import { UpdateUserProfileUseCase } from "../../modules/user/application/use-cases/UpdateUserProfileUseCase";
import { UpdateUserStatusUseCase } from "../../modules/user/application/use-cases/UpdateUserStatusUseCase";
import { UpdateClientRatingUseCase } from "../../modules/user/application/use-cases/UpdateClientRatingUseCase";
import { GetClientByIdUseCase } from "../../modules/user/application/use-cases/GetClientByIdUseCase";
import { UpdateDriverMetricsUseCase } from "../../modules/user/application/use-cases/UpdateDriverMetricsUseCase";
import { UpdateDriverStatusUseCase } from "../../modules/user/application/use-cases/UpdateDriverStatusUseCase";
import { UpdateDriverLicenseUseCase } from "../../modules/user/application/use-cases/UpdateDriverLicenseUseCase";
import { GetDriverByIdUseCase } from "../../modules/user/application/use-cases/GetDriverByIdUseCase";
import { RegisterPsychologicalEvaluationUseCase } from "../../modules/user/application/use-cases/RegisterPsychologicalEvaluationUseCase";
import { GetPsychologicalEvaluationsUseCase } from "../../modules/user/application/use-cases/GetPsychologicalEvaluationsUseCase";
import { RegisterEmergencyContactUseCase } from "../../modules/user/application/use-cases/RegisterEmergencyContactUseCase";
import { GetEmergencyContactsUseCase } from "../../modules/user/application/use-cases/GetEmergencyContactsUseCase";
import { GetAllUsersUseCase } from "@/modules/user/application/use-cases/GetAllUsersUseCase";

import { UserController } from "../../modules/user/presentation/controllers/UserController";
import { ClientController } from "../../modules/user/presentation/controllers/ClientController";
import { DriverController } from "../../modules/user/presentation/controllers/DriverController";
import { PsychologicalEvaluationController } from "../../modules/user/presentation/controllers/PsychologicalEvaluationController";
import { EmergencyContactController } from "../../modules/user/presentation/controllers/EmergencyContactController";

import { PrismaTransactionManager } from "../infrastructure/PrismaTransactionManager";
import { prisma } from "../lib/prisma";

/**
 * ============================================================
 * UserContainer
 * ============================================================
 */
export class UserContainer {

    // ============================
    // Transaction Manager
    // ============================
    public static readonly transactionManager = new PrismaTransactionManager();

    // ============================
    // Repositories
    // ============================
    public static readonly userRepository = new PrismaUserRepository(prisma);
    public static readonly clientRepository = new PrismaClientRepository(prisma);
    public static readonly driverRepository = new PrismaDriverRepository(prisma);
    public static readonly psychologicalEvaluationRepository = new PrismaPsychologicalEvaluationRepository(prisma);
    public static readonly emergencyContactRepository = new PrismaEmergencyContactRepository(prisma);

    
    // NUESTRO APORTE: Inicializamos el repositorio de Bancos
    public static readonly bancoRepository = new BancoRepository(prisma);
    // ============================
    // User Use Cases
    // ============================

   
    public static readonly createUserUseCase = new CreateUserUseCase(
        this.userRepository,
        this.clientRepository,
        this.driverRepository,
        this.transactionManager,
        this.bancoRepository, 
    );

    public static readonly getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
    public static readonly updateUserProfileUseCase = new UpdateUserProfileUseCase(this.userRepository);
    public static readonly updateUserStatusUseCase = new UpdateUserStatusUseCase(this.userRepository);

    public static readonly  getAllUsersUseCase = new GetAllUsersUseCase(this.userRepository);

    // ============================
    // Client Use Cases
    // ============================
    public static readonly updateClientRatingUseCase = new UpdateClientRatingUseCase(this.clientRepository);
    public static readonly getClientByIdUseCase = new GetClientByIdUseCase(this.clientRepository);

    // ============================
    // Driver Use Cases
    // ============================
    public static readonly updateDriverMetricsUseCase = new UpdateDriverMetricsUseCase(this.driverRepository);
    
    public static readonly updateDriverStatusUseCase = new UpdateDriverStatusUseCase(
        this.driverRepository,
        this.emergencyContactRepository
    );

    public static readonly updateDriverLicenseUseCase = new UpdateDriverLicenseUseCase(this.driverRepository);
    public static readonly getDriverByIdUseCase = new GetDriverByIdUseCase(this.driverRepository);

    // ============================
    // Psychological Evaluation
    // ============================
    public static readonly registerPsychologicalEvaluationUseCase = new RegisterPsychologicalEvaluationUseCase(
        this.driverRepository,
        this.psychologicalEvaluationRepository
    );

    public static readonly getPsychologicalEvaluationsUseCase = new GetPsychologicalEvaluationsUseCase(
        this.psychologicalEvaluationRepository
    );

    // ============================
    // Emergency Contact Use Cases
    // ============================
    public static readonly registerEmergencyContactUseCase = new RegisterEmergencyContactUseCase(
        this.emergencyContactRepository,
        this.driverRepository
    );

    public static readonly getEmergencyContactsUseCase = new GetEmergencyContactsUseCase(
        this.emergencyContactRepository
    );

    // ============================
    // Controllers
    // ============================
    static readonly userController = new UserController(
        this.createUserUseCase,
        this.getUserByIdUseCase,
        this.updateUserProfileUseCase,
        this.updateUserStatusUseCase,
        this.getAllUsersUseCase

    );

    static readonly clientController = new ClientController(
        this.updateClientRatingUseCase,
        this.getClientByIdUseCase
    );

    static readonly driverController = new DriverController(
        this.updateDriverMetricsUseCase,
        this.updateDriverStatusUseCase,
        this.updateDriverLicenseUseCase,
        this.getDriverByIdUseCase
    );

    static readonly psychologicalEvaluationController = new PsychologicalEvaluationController(
        this.registerPsychologicalEvaluationUseCase,
        this.getPsychologicalEvaluationsUseCase
    );

    static readonly emergencyContactController = new EmergencyContactController(
        this.registerEmergencyContactUseCase,
        this.getEmergencyContactsUseCase
    );
}