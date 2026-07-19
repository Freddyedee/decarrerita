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

// NUESTRO APORTE: Importamos la interfaz del repositorio de bancos
// Asegúrate de que esta ruta apunte correctamente a tu módulo de bancos
import { IBancoRepository } from "../../../banco/domain/repositories/IBancoRepository"; 

export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly clientRepository: IClientRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly bancoRepository: IBancoRepository // <-- Inyectamos el repo de bancos
    ) {}

    async execute(request: CreateUserRequest): Promise<UserResponse> {

        // 1. Value Objects: validación de formatos
        const email = Email.create(request.email);
        const role = request.role;
        const phone = Phone.create(request.phone);
        const firstName = PersonName.create(request.firstName);
        const lastName = PersonName.create(request.lastName);
        const passwordHash = PasswordHash.create(request.passwordHash);

        // 2. Email único a nivel de todo el sistema
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // 3. RN-027: Validaciones específicas para el Chofer ANTES de la transacción
        let driverLicense: DriverLicense | null = null;
        let validatedBankId: number | null = null; // Guardará el banco validado

        if (role === UserRole.DRIVER) {
            
            if (!request.licenseNumber) {
                throw new Error("License number is required to register as a driver.");
            }
            driverLicense = DriverLicense.create(request.licenseNumber);

            // NUESTRO APORTE: Si envió un banco, validamos que exista y esté activo
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

        // 4. Crear la entidad base del Usuario
        const newUser = new User(
            null, // userId will be assigned by the database
            role,
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
            UserStatus.ACTIVO,
            new Date()
        );

        // 5. RN-026: usuario + fila especializada en una sola transacción
        const savedUser = await this.transactionManager.run(async (tx) => {

            const created = await this.userRepository.save(newUser, tx);
            const userId = created.getUserId()!;

            if (role === UserRole.CLIENT) {
                await this.clientRepository.create(userId, tx);

            } else if (role === UserRole.DRIVER) {
                // NUESTRO APORTE: Le pasamos el validatedBankId a la creación del chofer
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

        // 6. Retornar Response (Se mantiene igual que la versión de tu compañero)
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