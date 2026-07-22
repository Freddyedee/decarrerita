import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/UpdateUserProfileUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/UpdateUserStatusUseCase";

import { CreateUserRequest } from "../../application/dto/CreateUserRequest";

import { UserResponse } from "../../application/dto/UserResponse";

import { UpdateUserProfileRequest } from "../../application/dto/UpdateUserProfileRequest";
import { UpdateUserStatusRequest } from "../../application/dto/UpdateUserStatusRequest";
import { GetAllUsersUseCase } from "../../application/use-cases/GetAllUsersUseCase";

export class UserController {

    constructor(

        private readonly createUserUseCase: CreateUserUseCase,

        private readonly getUserByIdUseCase: GetUserByIdUseCase,

        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,

        private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,

        private readonly getAllUsersUseCase: GetAllUsersUseCase

    ) {}

    async createUser(
        request: CreateUserRequest
    ): Promise<UserResponse> {

        return await this.createUserUseCase.execute(request);

    }

    async getUserById(
        userId: number
    ): Promise<UserResponse> {

        return await this.getUserByIdUseCase.execute(userId);

    }

    async updateProfile(
        request: UpdateUserProfileRequest
    ): Promise<UserResponse> {

        return await this.updateUserProfileUseCase.execute(request);

    }

    async updateStatus(
        request: UpdateUserStatusRequest
    ): Promise<UserResponse> {

        return await this.updateUserStatusUseCase.execute(request);

    }

    async getAllUsers(): Promise<UserResponse[]> {
        return await this.getAllUsersUseCase.execute();
    }

}