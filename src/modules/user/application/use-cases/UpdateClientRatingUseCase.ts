import { UpdateClientRatingRequest } from "../dto/UpdateClientRatingRequest";
import { ClientResponse } from "../dto/ClientResponse";
import { IClientRepository } from "../ports/IClientRepository";

export class UpdateClientRatingUseCase {

    constructor(
        private readonly clientRepository: IClientRepository
    ) {}

    async execute(
        request: UpdateClientRatingRequest
    ): Promise<ClientResponse> {

        const client = await this.clientRepository.findByUserId(
            request.userId
        );

        if (!client) {
            throw new Error("Client not found.");
        }

        client.changeAverageRating(
            request.averageRating
        );

        const updatedClient =
            await this.clientRepository.update(client);

        return {

            userId: updatedClient.getUserId(),

            averageRating: updatedClient.getAverageRating()

        };

    }

}