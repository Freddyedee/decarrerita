import { CancelarTrasladoDTO } from "../dto/CancelarTrasladoDto";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";

import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";
import { ITarifaRepository } from "@/modules/Tarifa/domain/repositories/ITarifaRepository";
import { IWalletService } from "@/modules/wallet/domain/ports/IWalletServices";
import { ITransactionManager } from "@/shared/domain/ITransactionManager";

/**
 * ============================================================
 * CancelarTrasladoUseCase
 * ============================================================
 *
 * Reglas aplicadas:
 *
 * - Quien cancela, paga la penalización — nunca la contraparte.
 * - Si el viaje nunca llegó a EN_CURSO (BUSCANDO_CHOFER o
 *   ASIGNADO), no hay dinero movido: se descuenta la
 *   penalización directo del actor que cancela.
 * - Si el viaje ya está EN_CURSO, el cliente ya pagó el costo
 *   completo a la wallet Empresa:
 *     - Si cancela el CLIENTE: recibe reembolso menos la
 *       penalización (la empresa retiene esa diferencia).
 *     - Si cancela el CHOFER: el cliente recibe reembolso
 *       COMPLETO (no es su culpa), y el chofer paga la
 *       penalización de su propio saldo, aparte.
 * - Si el viaje está en SIN_CHOFER (nadie aceptó, no fue una
 *   cancelación activa de nadie), no aplica ninguna penalización.
 *
 * ============================================================
 */

export class CancelarTrasladoUseCase {

    constructor(
        private readonly trasladoRepository: ITrasladoRepository, 
        private readonly historialRepository: IHistorialTrasladoRepository, 
        private readonly tarifaRepository: ITarifaRepository, 
        private readonly walletService: IWalletService, 
        private readonly transactionManager: ITransactionManager
    ){}

    async execute(input: CancelarTrasladoDTO){ 

        const traslado = await this.trasladoRepository.findById(input.trasladoId); 

        if(!traslado){
            throw new Error(`Traslado ${input.trasladoId} not found`);
        }

        const estadoAnterior = traslado.estadoActual;

        // La Entity ya bloquea cancelar un FINALIZADO o un
        // CANCELADO previo (RN-016/RN-017).
        traslado.cancelar();

        const previouslyCharged = estadoAnterior === EstadoTraslado.EN_CURSO; 
        const withoutAssignment = estadoAnterior === EstadoTraslado.SIN_CHOFER; 

        const updatedTraslado = await this.transactionManager.run(async(tx) => {


            if(withoutAssignment){
                //Nadie acepto el viaje, esto no es una cancelacion del usuario, ho hay penalizacion. 
                return this.trasladoRepository.update(traslado, tx); 
            }

            const tarifa = await this.tarifaRepository.findById(traslado.tarifaId); 

            if(!tarifa){ 
                throw new Error (`Tarifa ${traslado.tarifaId} not found`);
            }

            const penalization = tarifa.calcularPenalizacionCancelacion(); 

            if(!previouslyCharged){
                //Buscando chofer o asignado: no se movio dinero aun. Se descuenta directo del que cancelo el viaje. 

                await this.walletService.aplicarPenalizacion(
                    input.actorId, penalization, traslado.id, input.motivo, tx
                ); 
            }else if(input.actorRole === "CLIENTE"){
                
                //EL CLIENTE ya pago, se le rembolsa menos la penalizacion, que la empresa retiene

                await this.walletService.reembolsarConPenalizacion(
                    traslado.clienteId, traslado.costoEstimado, penalization, traslado.id, tx
                ); 
            }else {
                // Cancela el CHOFER durante EN_CURSO: el cliente
                // no tuvo culpa, recibe reembolso completo.
                await this.walletService.reembolsarConPenalizacion(
                    traslado.clienteId, traslado.costoEstimado, 0, traslado.id, tx
                );

                //  El chofer paga la penzalizacion de su propio saldo 

                await this.walletService.aplicarPenalizacion(
                    traslado.choferId, penalization, traslado.id, input.motivo, tx
                );
            }

            return this.trasladoRepository.update(traslado, tx); 



        }); 

        await this.historialRepository.registrarCambio(
            updatedTraslado.id, 
            estadoAnterior, 
            EstadoTraslado.CANCELADO, 
            `Canceled by ${input.actorRole} (${input.actorId}: ${input.motivo})`
        ); 

        return updatedTraslado; 
    }

}



