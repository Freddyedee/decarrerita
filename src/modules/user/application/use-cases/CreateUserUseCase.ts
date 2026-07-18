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

/**
 * ============================================================
 * CreateUserUseCase
 * ============================================================
 *
 * RN-026: crear un usuario CLIENT o DRIVER es, en realidad, DOS
 * inserciones relacionadas (`usuario` + `cliente`/`chofer`), no
 * una. Antes de esta corrección, este UseCase solo insertaba en
 * `usuario` — el resultado era que ningún cliente/chofer
 * registrado podía usar el sistema (SolicitarTrasladoUseCase,
 * UpdateClientRatingUseCase, etc. buscan la fila especializada
 * por id_usuario y siempre la encontraban `null`). Ahora ambas
 * inserciones ocurren dentro de la MISMA transacción — o se
 * crean las dos filas, o no se crea ninguna (mismo patrón que
 * CancelarTrasladoUseCase/SolicitarTrasladoUseCase usan con
 * ITransactionManager).
 *
 * RN-027: si el rol es DRIVER, `licenseNumber` es obligatorio y
 * el chofer SIEMPRE nace en estado PENDIENTE — nunca se
 * auto-aprueba (ver Driver, UpdateDriverStatusUseCase).
 *
 * Nota sobre la wallet: NO se crea acá. Se crea sola mediante un
 * trigger de PostgreSQL (`trg_crear_wallet`, definido en
 * database/dql/007_Triggers_Basicos.sql) que se dispara
 * automáticamente después de cada INSERT en `usuario` — incluso
 * dentro de esta misma transacción, porque un trigger AFTER
 * INSERT corre en la transacción que lo originó. Si el entorno
 * de base de datos no tiene ese script aplicado, hay que
 * ejecutarlo antes de probar el registro de usuarios.
 *
 * ============================================================
 */
export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly clientRepository: IClientRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly transactionManager: ITransactionManager
    ) {}

    async execute(request: CreateUserRequest): Promise<UserResponse> {

        // 1. Value Objects: si alguno es inválido, falla ACÁ,
        //    antes de tocar la base de datos.
        const email = Email.create(request.email);
        const role = request.role;
        const phone = Phone.create(request.phone);
        const firstName = PersonName.create(request.firstName);
        const lastName = PersonName.create(request.lastName);
        const passwordHash = PasswordHash.create(request.passwordHash);

        // 2. Email único a nivel de todo el sistema (cualquier rol).
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // 3. RN-027: si es chofer, la licencia es obligatoria y se
        //    valida ANTES de abrir la transacción — si el formato
        //    es inválido, preferimos fallar rápido sin haber
        //    tocado la base de datos todavía.
        let driverLicense: DriverLicense | null = null;

        if (role === UserRole.DRIVER) {

            if (!request.licenseNumber) {
                throw new Error("License number is required to register as a driver.");
            }

            driverLicense = DriverLicense.create(request.licenseNumber);

        }

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

        // 4. RN-026: usuario + fila especializada, todo o nada.
        const savedUser = await this.transactionManager.run(async (tx) => {

            const created = await this.userRepository.save(newUser, tx);

            const userId = created.getUserId();

            if (role === UserRole.CLIENT) {

                await this.clientRepository.create(userId, tx);

            } else if (role === UserRole.DRIVER) {

                await this.driverRepository.create(
                    userId,
                    driverLicense!,
                    ApprovalStatus.PENDIENTE,
                    tx
                );

            }

            // ADMIN y STAFF no tienen tabla de especialización —
            // el usuario base es suficiente para esos roles.

            return created;

        });

        // 5. Retornar Response
        return {
            user_id: savedUser.userid,
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