import { CreateUserRequest } from "../dto/CreateUserRequest";
import { UserResponse } from "../dto/UserResponse";
import { IUserRepository } from "../ports/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { PasswordHash, PersonName, Phone } from "../../domain/value-objects";
import { User } from "../../domain/entitites/User";
import { UserStatus } from "../../domain/enums/UserStatus";


export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(request: CreateUserRequest): Promise<UserResponse> {

        const email = Email.create(request.email);
        const role = request.role;
        const phone = Phone.create(request.phone);
        const firstName = PersonName.create(request.firstName);
        const lastName = PersonName.create(request.lastName);
        const passwordHash = PasswordHash.create(request.passwordHash);

        // 1. Verificar email
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        const newUser = new User(
            null ,
            role,
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
            UserStatus.ACTIVO,
            new Date()
        );

        const savedUser = await this.userRepository.save(newUser);

        // 5. Retornar Response
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