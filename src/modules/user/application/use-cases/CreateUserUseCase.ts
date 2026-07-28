// En: src/modules/user/application/use-cases/CreateUserUseCase.ts

import { CreateUserRequest } from "../dto/CreateUserRequest";
import { UserResponse } from "../dto/UserResponse";
import { IUserRepository } from "../ports/IUserRepository";
import { IClientRepository } from "../ports/IClientRepository";
import { IDriverRepository } from "../ports/IDriverRepository";
import { Email } from "../../domain/value-objects/Email";
import { PasswordHash, PersonName, Phone } from "../../domain/value-objects";
import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { User } from "../../domain/entitites/User";
import { UserRole } from "../../domain/enums/UserRole";
import { UserStatus } from "../../domain/enums/UserStatus";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";
import { IBancoRepository } from "../../../banco/domain/repositories/IBancoRepository"; 

// 1. IMPORTAMOS EL PUERTO DESDE EL MÓDULO AUTH
import { IPasswordHasher } from "@/modules/auth/domain/services/IPasswordHasher";

export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly clientRepository: IClientRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly bancoRepository: IBancoRepository,
        private readonly passwordHasher: IPasswordHasher // <-- 2. LO INYECTAMOS AQUÍ
    ) {}

    async execute(request: CreateUserRequest): Promise<UserResponse> {

        // 1. Value Objects: validación de formatos base
        const email = Email.create(request.email);
        const role = request.role;
        const phone = Phone.create(request.phone);
        const firstName = PersonName.create(request.firstName);
        const lastName = PersonName.create(request.lastName);
        
        // 2. Email único a nivel de todo el sistema
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // 3. ENCRIPTACIÓN: Delegada de forma limpia a la infraestructura vía puerto
        const hashedString = await this.passwordHasher.hash(request.password);
        const passwordHash = PasswordHash.create(hashedString);

        // 4. RN-027: Validaciones específicas para el Chofer ANTES de la transacción
        let driverLicense: DriverLicense | null = null;
        let validatedBankId: number | null = null;

        if (role === UserRole.DRIVER) {
            if (!request.licenseNumber) {
                throw new Error("License number is required to register as a driver.");
            }
            driverLicense = DriverLicense.create(request.licenseNumber);

            if (request.bankId) {
                const banco = await this.bancoRepository.findById(request.bankId);
                if (!banco) {
                    throw new Error("El banco seleccionado no existe.");
                }
                if (!banco.activo) {
                    throw new Error("El banco seleccionado actualmente está inactivo. Por favor, seleccione otro.");
                }
                validatedBankId = request.bankId;
            }
        }

        // 5. Crear la entidad base del Usuario
        const newUser = new User(
            null,
            role,
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
            UserStatus.ACTIVO,
            new Date()
        );

        // 6. RN-026: usuario + fila especializada en una sola transacción
        const savedUser = await this.transactionManager.run(async (tx) => {
            const created = await this.userRepository.save(newUser, tx);
            const userId = created.getUserId()!;

            if (role === UserRole.CLIENT) {
                await this.clientRepository.create(userId, tx);
            } else if (role === UserRole.DRIVER) {
                await this.driverRepository.create(
                    userId,
                    driverLicense!,
                    ApprovalStatus.PENDIENTE,
                    validatedBankId, 
                    tx
                );
            }
            return created;
        });

        // 7. Retornar Response
        return {
            user_id: savedUser.getUserId()!,
            role: savedUser.getRole(),
            firstName: savedUser.getFirstName().getValue(),
            lastName: savedUser.getLastName().getValue(),
            email: savedUser.getEmail().getValue(),
            phone: savedUser.getPhone().getValue(),
            status: savedUser.getStatus(),
            createdAt: savedUser.createdAt
        };
    }
}