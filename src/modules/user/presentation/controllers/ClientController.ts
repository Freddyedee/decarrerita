import { UpdateClientRatingRequest } from "../../application/dto/UpdateClientRatingRequest";
import { UpdateClientRatingUseCase } from "../../application/use-cases/UpdateClientRatingUseCase";

export class ClientController {

    constructor(

        private readonly updateClientRatingUseCase:
            UpdateClientRatingUseCase

    ) {}

    async updateRating(
        request: UpdateClientRatingRequest
    ) {

        return this.updateClientRatingUseCase.execute(request);
    }

}