// modules/wallet/presentation/reportes.controller.ts

import { GetGananciasEmpresaUseCase } from "../application/use-cases/GetGananciasEmpresaUseCase";
import { GetPagadoAChoferUseCase } from "../application/use-cases/GetPagadoAChoferUseCase";

export class ReportesController {

    constructor(
        private readonly getGananciasEmpresaUseCase: GetGananciasEmpresaUseCase,
        private readonly GetPagadoAChoferUseCase: GetPagadoAChoferUseCase
    ) {}

    async getGanancias(desde: Date, hasta: Date) {
        return this.getGananciasEmpresaUseCase.execute(desde, hasta);
    }

    async getPagadoAChofer(choferId: number, desde: Date, hasta: Date){
        return this.GetPagadoAChoferUseCase.execute(choferId, desde, hasta);  
    }
}