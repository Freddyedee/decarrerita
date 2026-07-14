import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IRevisionRepository } from "../../domain/repositories/IRevisionVehicular";

export interface VehiculoConVencimiento {
   vehicleId: number;
    plate: string;
    model: string;
    driverId: number;
    ultimaRevisionFecha: Date | null;
    fechaVencimiento: Date | null;
    diasParaVencer: number | null; // negativo si ya venció
    estado: "sin_revision" | "vencida" | "por_vencer" | "vigente";
}
    
    export class GetVehiculosPorVencerUseCase {

    // Umbral de "próximo a vencer" — 30 días antes del vencimiento.
    // Si el negocio quiere cambiar este número, es la única línea a tocar.
    private static readonly DIAS_ALERTA_PREVIA = 30;

    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly revisionRepository: IRevisionRepository
    ) {}

    async execute(): Promise<VehiculoConVencimiento[]> {

        const vehiculos = await this.vehicleRepository.findAll();
        const revisiones = await this.revisionRepository.findLatestByVehicleIds(
            vehiculos.map(v => v.id)
        );

        const revisionPorVehiculo = new Map(revisiones.map(r => [r.vehicleId, r]));
        const ahora = new Date();

        return vehiculos.map(vehiculo => {

            const revision = revisionPorVehiculo.get(vehiculo.id);

            if (!revision) {
                return {
                    vehicleId: vehiculo.id,
                    plate: vehiculo.plate,
                    model: vehiculo.model,
                    driverId: vehiculo.driverId,
                    ultimaRevisionFecha: null,
                    fechaVencimiento: null,
                    diasParaVencer: null,
                    estado: "sin_revision" as const
                };
            }

            const diasParaVencer = Math.ceil(
                (revision.expirationDate.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
            );

            let estado: VehiculoConVencimiento["estado"];
            if (diasParaVencer < 0) {
                estado = "vencida";
            } else if (diasParaVencer <= GetVehiculosPorVencerUseCase.DIAS_ALERTA_PREVIA) {
                estado = "por_vencer";
            } else {
                estado = "vigente";
            }

            return {
                vehicleId: vehiculo.id,
                plate: vehiculo.plate,
                model: vehiculo.model,
                driverId: vehiculo.driverId,
                ultimaRevisionFecha: revision.date,
                fechaVencimiento: revision.expirationDate,
                diasParaVencer,
                estado
            };
        })
        // Ordenamos para que lo más urgente aparezca primero.
        .sort((a, b) => (a.diasParaVencer ?? -Infinity) - (b.diasParaVencer ?? -Infinity));
    }
}
