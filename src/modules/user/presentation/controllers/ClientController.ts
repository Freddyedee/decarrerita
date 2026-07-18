import { UpdateClientRatingRequest } from "../../application/dto/UpdateClientRatingRequest";
import { UpdateClientRatingUseCase } from "../../application/use-cases/UpdateClientRatingUseCase";
import { GetClientByIdUseCase } from "../../application/use-cases/GetClientByIdUseCase";
import { ClientResponse } from "../../application/dto/ClientResponse";

export class ClientController {

    constructor(

        private readonly updateClientRatingUseCase:
            UpdateClientRatingUseCase,

        private readonly getClientByIdUseCase: GetClientByIdUseCase

    ) {}

    async getById(userId: number): Promise<ClientResponse> {

        return this.getClientByIdUseCase.execute(userId);

    }

    async updateRating(
        request: UpdateClientRatingRequest
    ) {

        return this.updateClientRatingUseCase.execute(request);
    }

}