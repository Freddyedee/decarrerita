import { UserController } from "../controllers/UserController";

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { PrismaClientRepository } from "../../infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "../../infrastructure/repositories/PrismaDriverRepository";
import { BancoRepository } from "@/modules/banco/infrastructure/prisma/BancoRepository";
import { PrismaTransactionManager } from "@/shared/infrastructure/PrismaTransactionManager";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/UpdateUserStatusUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/UpdateUserProfileUseCase";
// 1. IMPORTAMOS EL CASO DE USO FALTANTE
import { GetAllUsersUseCase } from "../../application/use-cases/GetAllUsersUseCase"; 

// 2. CORREGIMOS LA RUTA DE PRISMA (Usando la de tu proyecto)
import { prisma } from "@/shared/lib/prisma"; 

// 3. INSTANCIAMOS TODO PASÁNDOLE PRISMA
const userRepository = new PrismaUserRepository(prisma);
const clientRepository = new PrismaClientRepository(prisma);
const driverRepository = new PrismaDriverRepository(prisma);
const transactionManager = new PrismaTransactionManager(); 
const bancoRepository = new BancoRepository(prisma);

// 4. SE LOS PASAMOS AL CASO DE USO EN EL ORDEN EXACTO
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
// 5. INSTANCIAMOS EL CASO DE USO FALTANTE
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository); 

export const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase,
    updateUserProfileUseCase,
    updateUserStatusUseCase,
    getAllUsersUseCase // 6. SE LO PASAMOS AL CONTROLADOR
);