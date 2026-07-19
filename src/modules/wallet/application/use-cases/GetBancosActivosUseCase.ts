import { IBancoRepository } from "../../domain/ports/IBancoRepository";
import { BancoResponse } from "../dto/WalletClientDTOs";

export class GetBancosActivosUseCase {

    constructor(
        private readonly bancoRepository: IBancoRepository
    ) {}

    async execute(): Promise<BancoResponse[]> {

        const bancos = await this.bancoRepository.findAllActive();

        return bancos.map(banco => ({
            id: banco.id,
            nombre: banco.nombre,
            codigo: banco.codigo,
            activo: banco.activo
        }));

    }

}