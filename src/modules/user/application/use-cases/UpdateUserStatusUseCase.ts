import { UpdateUserStatusRequest } from "../dto/UpdateUserStatusRequest";
import { UserResponse } from "../dto/UserResponse";
import { IUserRepository } from "../ports/IUserRepository";

import { UserStatus } from "../../domain/enums/UserStatus";

export class UpdateUserStatusUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        request: UpdateUserStatusRequest
    ): Promise<UserResponse> {

        const user =
            await this.userRepository.findById(request.userId);

        if (!user) {
            throw new Error("User not found.");
        }

        user.changeStatus(
            request.status as UserStatus
        );

        const updatedUser =
            await this.userRepository.update(user);

        return {

            user_id: updatedUser.getUserId()!,
            role: updatedUser.getRole(),
            firstName: updatedUser.getFirstName().getValue(),
            lastName: updatedUser.getLastName().getValue(),
            email: updatedUser.getEmail().getValue(),
            phone: updatedUser.getPhone().getValue(),
            status: updatedUser.getStatus(),
            createdAt: updatedUser.getCreatedAt()
        };

    }

}