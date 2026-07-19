import { DriverResponse } from "../dto/DriverResponse";
import { UpdateDriverMetricsRequest } from "../dto/UpdateDriverMetricsRequest";
import { IDriverRepository } from "../ports/IDriverRepository";

export class UpdateDriverMetricsUseCase {

    constructor(
        private readonly driverRepository: IDriverRepository
    ) {}

    async execute(
        request: UpdateDriverMetricsRequest
    ): Promise<DriverResponse> {

        // Buscar chofer
        const driver = await this.driverRepository.findByUserId(
            request.userId
        );

        if (!driver) {
            throw new Error("Driver not found.");
        }

        // Actualizar entidad
        driver.changeMetrics(
            request.averageRating,
            request.completedTrips
        );

        // Guardar
        const updatedDriver =
            await this.driverRepository.update(driver);

        // Retornar DTO
        return {

            userId: updatedDriver.getUserId(),

            licenseNumber:
                updatedDriver.getLicenseNumber().getValue(),

            status:
                updatedDriver.getStatus(),

            averageRating: updatedDriver.getAverageRating(),

            completedTrips: updatedDriver.getCompletedTrips(),

            bankId: updatedDriver.getBankId(), 

        };

    }

}