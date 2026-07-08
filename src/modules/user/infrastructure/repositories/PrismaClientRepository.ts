import { PrismaClient } from "@prisma/client";

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

    async update(client: Client): Promise<Client> {

        const updatedClient = await this.prisma.cliente.update({

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