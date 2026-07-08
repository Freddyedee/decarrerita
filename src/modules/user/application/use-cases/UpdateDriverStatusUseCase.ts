import { DriverResponse } from "../dto/DriverResponse";
import { UpdateDriverStatusRequest } from "../dto/UpdateDriverStatusRequest";
import { IDriverRepository } from "../ports/IDriverRepository";

export class UpdateDriverStatusUseCase {

    constructor(
        private readonly driverRepository: IDriverRepository
    ) {}

    async execute(
        request: UpdateDriverStatusRequest
    ): Promise<DriverResponse> {

        const driver =
            await this.driverRepository.findByUserId(
                request.userId
            );

        if (!driver) {
            throw new Error("Driver not found.");
        }

        driver.changeStatus(
            request.status
        );

        const updatedDriver =
            await this.driverRepository.update(driver);

        return {

            userId: updatedDriver.getUserId(),

            licenseNumber:
                updatedDriver.getLicenseNumber().getValue(),

            status:
                updatedDriver.getStatus(),

            averageRating: updatedDriver.getAverageRating(),

            completedTrips: updatedDriver.getCompletedTrips()

        };

    }

}