import { CreateMarcaDTO } from "../application/dto/create-marca-dto";
import { CreateMarcaUseCase } from "../application/use-cases/CreateMarcaUseCase";
import { GetAllMarcasUseCase } from "../application/use-cases/GetAllMarcasUseCase";

export class MarcaController {

    constructor(
        private readonly createMarcaUseCase: CreateMarcaUseCase,
        private readonly getAllMarcasUseCase: GetAllMarcasUseCase
    ) {}

    async create(body: CreateMarcaDTO) {
        return this.createMarcaUseCase.execute(body);
    }

    async getAll() {
        return this.getAllMarcasUseCase.execute();
    }
}