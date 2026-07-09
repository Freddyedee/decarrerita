import { UserController } from "../controllers/UserController";

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/UpdateUserStatusUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/UpdateUserProfileUseCase";
import { prisma } from "@/infra/prisma/client";

const repository = new PrismaUserRepository(prisma);

const createUserUseCase = new CreateUserUseCase(repository);

const getUserByIdUseCase = new GetUserByIdUseCase(repository);

const updateUserProfileUseCase = new UpdateUserProfileUseCase(repository);

const updateUserStatusUseCase = new UpdateUserStatusUseCase(repository);

/////////////////////////////////////////////////////////////

export const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase,
    updateUserProfileUseCase,
    updateUserStatusUseCase
);