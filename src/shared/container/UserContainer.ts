import { PrismaUserRepository } from "../../modules/user/infrastructure/repositories/PrismaUserRepository";
import { PrismaClientRepository } from "../../modules/user/infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "../../modules/user/infrastructure/repositories/PrismaDriverRepository";
import { PrismaPsychologicalEvaluationRepository } from "../../modules/user/infrastructure/repositories/PrismaPsychologicalEvaluationRepository";
import { PrismaEmergencyContactRepository } from "../../modules/user/infrastructure/repositories/PrismaEmergencyContactRepository";

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
 *
 * Cablea (Dependency Injection manual, sin framework) todo el
 * módulo `user`: repositorios Prisma -> casos de uso ->
 * controllers, en ese orden de dependencia.
 *
 * ⚠️ Este es el ÚNICO punto de wiring del módulo user. Antes
 * existía un segundo archivo (`presentation/router/UserRouter.ts`)
 * que armaba SU PROPIA copia de userController con instancias
 * de repos/use-cases totalmente distintas a las de acá — dos
 * rutas API (`/api/users`, `/api/users/[id]`) usaban esa copia
 * mientras el resto (`/api/users/[id]/profile`, `/status`, etc.)
 * usaba este container. Se consolidó todo para que exista una
 * sola fuente de verdad (ver rutas en src/app/api/users/*, todas
 * importan de acá ahora).
 *
 * ============================================================
 */
export class UserContainer {

    // ============================
    // Transaction Manager
    // ============================

    /**
     * RN-026: usado por CreateUserUseCase para que la creación
     * de `usuario` + `cliente`/`chofer` sea atómica (ver ese
     * UseCase). Mismo manager que ya usan Wallet y Traslado.
     */
    public static readonly transactionManager =
        new PrismaTransactionManager();

    // ============================
    // Repositories
    // ============================

    public static readonly userRepository =
        new PrismaUserRepository(prisma);

    public static readonly clientRepository =
        new PrismaClientRepository(prisma);

    public static readonly driverRepository =
        new PrismaDriverRepository(prisma);

    public static readonly psychologicalEvaluationRepository =
        new PrismaPsychologicalEvaluationRepository(prisma);

    public static readonly emergencyContactRepository =
        new PrismaEmergencyContactRepository(prisma);

    // ============================
    // User Use Cases
    // ============================

    public static readonly createUserUseCase =
        new CreateUserUseCase(
            this.userRepository,
            this.clientRepository,
            this.driverRepository,
            this.transactionManager
        );

    public static readonly getUserByIdUseCase =
        new GetUserByIdUseCase(
            this.userRepository
        );

    public static readonly updateUserProfileUseCase =
        new UpdateUserProfileUseCase(
            this.userRepository
        );

    public static readonly updateUserStatusUseCase =
        new UpdateUserStatusUseCase(
            this.userRepository
        );

    // ============================
    // Client Use Cases
    // ============================

    public static readonly updateClientRatingUseCase =
        new UpdateClientRatingUseCase(
            this.clientRepository
        );

    public static readonly getClientByIdUseCase =
        new GetClientByIdUseCase(
            this.clientRepository
        );

    // ============================
    // Driver Use Cases
    // ============================

    public static readonly updateDriverMetricsUseCase =
        new UpdateDriverMetricsUseCase(
            this.driverRepository
        );

    // RN-028: requiere también el repositorio de contactos de
    // emergencia para validar el mínimo antes de aprobar.
    public static readonly updateDriverStatusUseCase =
        new UpdateDriverStatusUseCase(
            this.driverRepository,
            this.emergencyContactRepository
        );

    public static readonly updateDriverLicenseUseCase =
        new UpdateDriverLicenseUseCase(
            this.driverRepository
        );

    public static readonly getDriverByIdUseCase =
        new GetDriverByIdUseCase(
            this.driverRepository
        );

    // ============================
    // Psychological Evaluation
    // ============================

    public static readonly registerPsychologicalEvaluationUseCase =
        new RegisterPsychologicalEvaluationUseCase(
            this.driverRepository,
            this.psychologicalEvaluationRepository
        );

    public static readonly getPsychologicalEvaluationsUseCase =
        new GetPsychologicalEvaluationsUseCase(
            this.psychologicalEvaluationRepository
        );

    // ============================
    // Emergency Contact Use Cases
    // ============================

    public static readonly registerEmergencyContactUseCase =
        new RegisterEmergencyContactUseCase(
            this.emergencyContactRepository,
            this.driverRepository
        );

    public static readonly getEmergencyContactsUseCase =
        new GetEmergencyContactsUseCase(
            this.emergencyContactRepository
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
            this.updateClientRatingUseCase,
            this.getClientByIdUseCase
        );

    static readonly driverController =
        new DriverController(
            this.updateDriverMetricsUseCase,
            this.updateDriverStatusUseCase,
            this.updateDriverLicenseUseCase,
            this.getDriverByIdUseCase
        );

    static readonly psychologicalEvaluationController =
        new PsychologicalEvaluationController(
            this.registerPsychologicalEvaluationUseCase,
            this.getPsychologicalEvaluationsUseCase
        );

    static readonly emergencyContactController =
        new EmergencyContactController(
            this.registerEmergencyContactUseCase,
            this.getEmergencyContactsUseCase
        );

}