import { UserController } from "../controllers/UserController";

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
// 1. IMPORTAMOS LOS NUEVOS REPOSITORIOS Y EL MANAGER
import { PrismaClientRepository } from "../../infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "../../infrastructure/repositories/PrismaDriverRepository";
import { BancoRepository } from "@/modules/banco/infrastructure/prisma/BancoRepository";
import { PrismaTransactionManager } from "@/shared/infrastructure/PrismaTransactionManager";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/UpdateUserStatusUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/UpdateUserProfileUseCase";
import { prisma } from "@/infra/prisma/client";

// 2. INSTANCIAMOS TODO PASÁNDOLE PRISMA
const userRepository = new PrismaUserRepository(prisma);
const clientRepository = new PrismaClientRepository(prisma);
const driverRepository = new PrismaDriverRepository(prisma);
const transactionManager = new PrismaTransactionManager(); 
const bancoRepository = new BancoRepository();

// 3. SE LOS PASAMOS AL CASO DE USO EN EL ORDEN EXACTO DEL CONSTRUCTOR
const createUserUseCase = new CreateUserUseCase(
    userRepository,
    clientRepository,
    driverRepository,
    transactionManager,
    bancoRepository
);

const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);

/////////////////////////////////////////////////////////////

export const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase,
    updateUserProfileUseCase,
    updateUserStatusUseCase,
);