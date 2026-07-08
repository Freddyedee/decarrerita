import { UserController } from "../controllers/UserController";

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";

const repository = new PrismaUserRepository();

const createUserUseCase = new CreateUserUseCase(repository);

const getUserByIdUseCase = new GetUserByIdUseCase(repository);

/////////////////////////////////////////////////////////////

export const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase
);