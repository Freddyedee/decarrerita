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
            user_id: savedUser.userid,
            role: newUser.getRole(),
            firstName: newUser.getFirstName().getValue(),
            lastName: newUser.getLastName().getValue(),
            email: newUser.getEmail().getValue(),
            phone: newUser.getPhone().getValue(),
            status: newUser.getStatus(),
            createdAt: newUser.createdAt
        };
    }

}