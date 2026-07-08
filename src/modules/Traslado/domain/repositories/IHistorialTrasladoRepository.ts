// domain/repositories/IHistorialTrasladoRepository.ts

/**
 * Puerto para el registro de auditoría de cambios de estado.
 * Es puramente de escritura desde la perspectiva de Traslados:
 * cada UseCase que cambia un estado, registra aquí el cambio.
 */
export interface IHistorialTrasladoRepository {

    registrarCambio(
        trasladoId: number,
        estadoAnterior: string,
        estadoNuevo: string,
        observacion?: string
    ): Promise<void>;
}