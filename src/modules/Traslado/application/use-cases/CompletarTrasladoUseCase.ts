import { CompletarTrasladoDto } from "../dto/CompletarTrasladoDto";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";

import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";
import { ITarifaRepository } from "@/modules/Tarifa/domain/repositories/ITarifaRepository";
import { IWalletService } from "@/modules/wallet/domain/ports/IWalletServices";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";

/**
 * ============================================================
 * CompletarTrasladoUseCase
 * ============================================================
 *
 * RN-012: solo un viaje EN_CURSO puede completarse.
 * RN-013: el cambio de estado debe registrarse en historial.
 * RN-014: al completar, se paga al chofer.
 * RN-015: la comisión de la empresa ya quedó retenida desde
 *         el débito inicial (IniciarTrasladoUseCase) — aquí
 *         solo se le transfiere al chofer su parte.
 *
 * ============================================================
 */

export class CompletarTrasladoUseCase  {

    constructor (
        private readonly trasladoRepository: ITrasladoRepository, 
        private readonly historialRepository: IHistorialTrasladoRepository, 
        private readonly tarifaRepository: ITarifaRepository, 
        private readonly walletService: IWalletService, 
        private readonly transactionManager: ITransactionManager
    ){}

    async execute(input: CompletarTrasladoDto){ 

        const traslado = await this.trasladoRepository.findById(input.trasladoId); 

        if(!traslado){
            throw new Error(`Traslado ${input.trasladoId} not found`);
        }

        const estadoAnterior = traslado.estadoActual; 

        // Se usa la tarifa HISTÓRICA del traslado (por id fijo),
        // no la vigente actual — pudo haber cambiado desde que
        // se solicitó el viaje, pero el negocio ya pactado con
        // este cliente/chofer no debe verse afectado

        const tarifa = await this.tarifaRepository.findById(traslado.tarifaId); 
        if(!tarifa){
            throw new Error(`Tarifa ${traslado.tarifaId} not found`); 
        }

        const { pagoChofer } = tarifa.calcularReparto(traslado.costoEstimado); 

        traslado.completar(); // valida en memoria que venía de EN_CURSO

        const updatedTraslado = await this.transactionManager.run(async (tx) => {

            await this.walletService.creditarChofer(
                traslado.choferId,
                pagoChofer, 
                traslado.id, 
                tx
            );
            return this.trasladoRepository.update(traslado, tx); 
        }); 

        await this.historialRepository.registrarCambio(
            updatedTraslado.id,
            estadoAnterior,
            EstadoTraslado.FINALIZADO,
            "Trip completed, driver paid"
        ); 


        return updatedTraslado; 

    }
}