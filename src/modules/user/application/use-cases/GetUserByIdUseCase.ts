import { UserResponse } from "../dto/UserResponse";
import { IUserRepository } from "../ports/IUserRepository";

export class GetUserByIdUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(id: number): Promise<UserResponse> {

        // 1. Buscar usuario
        const user = await this.userRepository.findById(id);

        // 2. Verificar existencia
        if (!user) {
            throw new Error("User not found.");
        }

          if (user.userid === null) {
            throw new Error("User id is missing.");
        }

        // 3. Retornar DTO
        return {
            user_id: user.userid,
            role: user.getRole(),
            firstName: user.getFirstName().getValue(),
            lastName: user.getLastName().getValue(),
            email: user.getEmail().getValue(),
            phone: user.getPhone().getValue(),
            status: user.getStatus(),
            createdAt: user.createdAt
        };
    }

}