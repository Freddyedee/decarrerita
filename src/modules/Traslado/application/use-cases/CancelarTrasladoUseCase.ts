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

