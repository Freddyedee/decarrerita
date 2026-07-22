import { IUserRepository } from "../ports/IUserRepository";
import { UserResponse } from "../dto/UserResponse";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<UserResponse[]> {
        const users = await this.userRepository.findAll();

        return users.map(user => ({
            user_id: user.getUserId() ?? null,
            role: user.getRole(),
            firstName: user.getFirstName().getValue(),
            lastName: user.getLastName().getValue(),
            email: user.getEmail().getValue(),
            phone: user.getPhone().getValue(),
            status: user.getStatus(),
            createdAt: user.createdAt // Si tienes un getter como user.getCreatedAt(), cámbialo aquí
        }));
    }
}