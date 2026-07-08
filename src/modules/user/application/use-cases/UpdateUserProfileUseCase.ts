import { UserResponse } from "../dto/UserResponse";
import { UpdateUserProfileRequest } from "../dto/UpdateUserProfileRequest";
import { IUserRepository } from "../ports/IUserRepository";

import {
    Email,
    PasswordHash,
    PersonName,
    Phone
} from "../../domain/value-objects";

export class UpdateUserProfileUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        request: UpdateUserProfileRequest
    ): Promise<UserResponse> {

        // Buscar usuario
        const user = await this.userRepository.findById(request.userId);

        if (!user) {
            throw new Error("User not found.");
        }

        // Crear Value Objects
        const firstName = PersonName.create(request.firstName);
        const lastName = PersonName.create(request.lastName);
        const email = Email.create(request.email);
        const phone = Phone.create(request.phone);
        const passwordHash = PasswordHash.create(request.password);

        // Si cambió el email verificar que no exista
        if (email.getValue() !== user.getEmail().getValue()) {

            const existingUser =
                await this.userRepository.findByEmail(email);

            if (existingUser) {
                throw new Error("Email already in use.");
            }
        }

        // Modificar entidad
        user.changeProfile(
            firstName,
            lastName,
            email,
            phone,
            passwordHash
        );

        // Guardar
        const updatedUser =
            await this.userRepository.update(user);

        // Respuesta
        return {

            user_id: updatedUser.getUserId()!,

            role: updatedUser.getRole(),

            firstName: updatedUser.getFirstName().getValue(),

            lastName: updatedUser.getLastName().getValue(),

            email: updatedUser.getEmail().getValue(),

            phone: updatedUser.getPhone().getValue(),

            status: updatedUser.getStatus(),

            createdAt: updatedUser.getCreatedAt(),

        };

    }

}