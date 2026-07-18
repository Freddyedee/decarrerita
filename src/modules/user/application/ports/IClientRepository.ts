import { Client } from "../../domain/entitites/Client";
import { Prisma } from "@prisma/client";

export interface IClientRepository {

    findByUserId(userId: number): Promise<Client | null>;

    /**
     * RN-026: crea la fila especializada `cliente` para un
     * `usuario` ya existente (mismo id_usuario, PK compartida).
     * Se llama SIEMPRE desde CreateUserUseCase cuando el rol es
     * CLIENT, dentro de la misma transacción que crea el usuario
     * — nunca de forma independiente, para que nunca pueda
     * existir un usuario con rol CLIENT sin su fila `cliente`.
     */
    create(userId: number, tx?: Prisma.TransactionClient): Promise<Client>;

    update(client: Client, tx?: Prisma.TransactionClient): Promise<Client>;

}