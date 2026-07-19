import { ClientResponse } from "../dto/ClientResponse";
import { IClientRepository } from "../ports/IClientRepository";

export class GetClientByIdUseCase {

    constructor(
        private readonly clientRepository: IClientRepository
    ) {}

    async execute(userId: number): Promise<ClientResponse> {

        const client = await this.clientRepository.findByUserId(userId);

        if (!client) {
            throw new Error("Client not found.");
        }

        return {

            userId: client.getUserId(),

            averageRating: client.getAverageRating()

        };

    }

}