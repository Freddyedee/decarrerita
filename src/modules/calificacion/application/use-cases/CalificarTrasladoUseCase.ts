import { CalificarTrasladoDTO } from "../DTO/CalificarTrasladoDTO";
import { Calificacion } from "../../domain/Calificacion";
import { ICalificacionRepository } from "../../domain/repositories/ICalificacionRepository";
import { ITrasladoRepository } from "@/modules/Traslado/domain/repositories/ITrasladoRepository";
import { EstadoTraslado } from "@/modules/Traslado/domain/Enum/EstadoTraslado";
import { IDriverRepository } from "@/modules/user/application/ports/IDriverRepository";
import { IClientRepository } from "@/modules/user/application/ports/IClientRepository";

export class CalificarTrasladoUseCase {

    constructor(
        private readonly calificacionRepository: ICalificacionRepository,
        private readonly trasladoRepository: ITrasladoRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly clientRepository: IClientRepository
    ) {}

    async execute(input: CalificarTrasladoDTO): Promise<Calificacion> {

        const traslado = await this.trasladoRepository.findById(input.trasladoId);
        if (!traslado) throw new Error(`Traslado ${input.trasladoId} not found`);

        if (traslado.estadoActual !== EstadoTraslado.FINALIZADO) {
            throw new Error(`Cannot rate a traslado in state ${traslado.estadoActual}`);
        }

        if (input.puntuacion < Calificacion.PUNTUACION_MIN || input.puntuacion > Calificacion.PUNTUACION_MAX) {
            throw new Error(`Puntuacion must be between ${Calificacion.PUNTUACION_MIN} and ${Calificacion.PUNTUACION_MAX}`);
        }

        const calificacion = new Calificacion(
            0, traslado.id, traslado.clienteId, traslado.choferId,
            input.calificadorEsCliente, input.puntuacion,
            input.comentario ?? null, new Date()
        );

        const saved = await this.calificacionRepository.create(calificacion);

        if (input.calificadorEsCliente) {
            // El cliente califica al chofer: actualiza su promedio.
            const nuevoPromedio = await this.calificacionRepository.promedioByChoferId(traslado.choferId);
            if (nuevoPromedio !== null) {
                const driver = await this.driverRepository.findByUserId(traslado.choferId);
                if (driver) {
                    const viajesCompletados = (driver.getCompletedTrips() ?? 0) + 1;
                    driver.changeMetrics(nuevoPromedio, viajesCompletados);
                    await this.driverRepository.update(driver);
                }
            }
        } else {
            // El chofer califica al cliente: actualiza su rating.
            const nuevoPromedio = await this.calificacionRepository.promedioByClienteId(traslado.clienteId);
            if (nuevoPromedio !== null) {
                const client = await this.clientRepository.findByUserId(traslado.clienteId);
                if (client) {
                    client.changeAverageRating(nuevoPromedio);
                    await this.clientRepository.update(client);
                }
            }
        }

        return saved;
    }
}