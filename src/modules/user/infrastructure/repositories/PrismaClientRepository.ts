import { PrismaClient, Prisma } from "@prisma/client";

import { Client } from "../../domain/entitites/Client";

import { IClientRepository } from "../../application/ports/IClientRepository";

export class PrismaClientRepository implements IClientRepository {

    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async findByUserId(userId: number): Promise<Client | null> {

        const client = await this.prisma.cliente.findUnique({

            where: {
                id_usuario: userId
            }

        });

        if (!client) {
            return null;
        }

        return this.toDomain(client);

    }

    /**
     * RN-026: no recibe `rating_promedio` — la columna tiene
     * default 5.00 en la base de datos (ver DDL), así que todo
     * cliente nuevo arranca con el mismo rating neutral que un
     * chofer nuevo. Recibe `tx` para insertarse dentro de la
     * misma transacción que crea el `usuario` (ver
     * CreateUserUseCase).
     */
    async create(userId: number, tx?: Prisma.TransactionClient): Promise<Client> {

        const db = tx ?? this.prisma;

        const created = await db.cliente.create({

            data: {
                id_usuario: userId
            }

        });

        return this.toDomain(created);

    }

    async update(client: Client, tx?: Prisma.TransactionClient): Promise<Client> {

        const db = tx ?? this.prisma;

        const updatedClient = await db.cliente.update({

            where: {
                id_usuario: client.getUserId()
            },

            data: {

                rating_promedio:
                    client.getAverageRating()

            }

        });

        return this.toDomain(updatedClient);

    }

    private toDomain(
        client: import("@prisma/client").cliente
    ): Client {

        return new Client(

            client.id_usuario,

            Number(client.rating_promedio ?? 5)

        );

    }

}