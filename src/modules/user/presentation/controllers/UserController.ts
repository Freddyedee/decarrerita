import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";

import { CreateUserRequest } from "../../application/dto/CreateUserRequest";

export class UserController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase
    ) {}

    async createUser(body: CreateUserRequest) {

        const response =
            await this.createUserUseCase.execute(body);

        return response;

    }

    async getUserById(id: number) {

        const response =
            await this.getUserByIdUseCase.execute(id);

        return response;

    }


    /////////////////////////////////////////////////////////////////////////
}