import { LoginRequest } from "../dto/LoginRequest";
import { SessionResponse } from "../dto/SessionResponse";
import { Email } from "@modules/user/domain/value-objects/Email";

import { IUserRepository } from "@modules/user/application/ports/IUserRepository";

import { IPasswordHasher } from "../../domain/services/IPasswordHasher";

export class LoginUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(
        request: LoginRequest
    ): Promise<SessionResponse> {

        const email = Email.create(request.email);

        const user = await this.userRepository.findByEmail(
            email
        );

        if (!user) {

            throw new Error("Invalid email or password.");

        }



        const passwordMatches =
            await this.passwordHasher.compare(
                request.password,
                user.getPasswordHash().getValue()
            );

        if (!passwordMatches) {

            throw new Error("Invalid email or password.");

        }

        if (!user.isActive()) {

            throw new Error("User account is not active.");

        }

        return {

            user: {

                id: user.getUserId(),

                email: user.getEmail().getValue(),

                role: user.getRole(),

                status: user.getStatus()

            }

        };

    }

}