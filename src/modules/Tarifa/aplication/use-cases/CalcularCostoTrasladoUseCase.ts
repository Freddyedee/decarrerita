// application/use-cases/CalcularCostoTrasladoUseCase.ts
//
// Este será el UseCase público que el módulo Traslados
// va a importar directamente cuando llegue el momento.

import { ITarifaRepository } from "../../domain/repositories/ITarifaRepository";
import { IConfiguracionRepository } from "@/modules/configuracion/domain/repositories/IConfiguracionRepository";

interface CostoTrasladoResult {
    costoBase: number;
    aplicoRecargoNocturno: boolean;
    costoFinal: number;
    comisionEmpresa: number;
    pagoChofer: number;
}

export class CalcularCostoTrasladoUseCase {

    constructor(
        private readonly tarifaRepository: ITarifaRepository,
        private readonly configRepository: IConfiguracionRepository
    ) {}

    async execute(distanciaKm: number, fechaHora: Date = new Date()): Promise<CostoTrasladoResult> {

        const tarifa = await this.tarifaRepository.findVigente(fechaHora);
        if (!tarifa) throw new Error("No active tarifa found");

        const costoBase = tarifa.calcularCosto(distanciaKm);

        const esNoche = await this.esHorarioNocturno(fechaHora);
        const recargoPct = esNoche ? await this.getRecargoNocturnoPct() : 0;

        const costoFinal = costoBase * (1 + recargoPct / 100);
        const { comisionEmpresa, pagoChofer } = tarifa.calcularReparto(costoFinal);

        return { costoBase, aplicoRecargoNocturno: esNoche, costoFinal, comisionEmpresa, pagoChofer };
    }

    private async esHorarioNocturno(fechaHora: Date): Promise<boolean> {

        const inicio = await this.configRepository.findByNombre("hora_inicio_nocturno"); // ej: "20:00"
        const fin = await this.configRepository.findByNombre("hora_fin_nocturno");        // ej: "06:00"

        if (!inicio || !fin) return false; // sin configurar, no aplica recargo

        const hora = fechaHora.getHours();
        const [hIni] = inicio.split(":").map(Number);
        const [hFin] = fin.split(":").map(Number);

        // Rango que cruza medianoche (ej. 20 a 6)
        if (hIni > hFin) {
            return hora >= hIni || hora < hFin;
        }
        return hora >= hIni && hora < hFin;
    }

    private async getRecargoNocturnoPct(): Promise<number> {
        const valor = await this.configRepository.findByNombre("recargo_nocturno_porcentaje");
        return valor ? Number(valor) : 0;
    }
}