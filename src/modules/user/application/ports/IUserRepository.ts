import { User } from "../../domain/entitites/User";
import { Email } from "../../domain/value-objects/Email";
import { Prisma } from "@prisma/client";

export interface IUserRepository {
    findById(id: number): Promise<User | null>;

    findByEmail(email: Email): Promise<User | null>;

    /**
     * RN-026: `save` SOLO inserta la fila base en `usuario`.
     * Nunca crea `cliente` ni `chofer` — eso es responsabilidad
     * de CreateUserUseCase, que llama a este método y, según el
     * rol, también a IClientRepository.create/IDriverRepository.create,
     * TODO dentro de la misma transacción (por eso el parámetro
     * `tx` opcional: permite que las 2-3 inserciones (usuario +
     * cliente/chofer) se confirmen o se reviertan juntas — ver el
     * patrón ya usado en Wallet/Traslado con ITransactionManager).
     */
    save(user: User, tx?: Prisma.TransactionClient): Promise<User>;

    update(user: User, tx?: Prisma.TransactionClient): Promise<User>;

}