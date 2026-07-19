import { DriverResponse } from "../dto/DriverResponse";
import { IDriverRepository } from "../ports/IDriverRepository";

export class GetDriverByIdUseCase {

    constructor(
        private readonly driverRepository: IDriverRepository
    ) {}

    async execute(userId: number): Promise<DriverResponse> {

        const driver = await this.driverRepository.findByUserId(userId);

        if (!driver) {
            throw new Error("Driver not found.");
        }

        return {

            userId: driver.getUserId(),

            licenseNumber: driver.getLicenseNumber().getValue(),

            status: driver.getStatus(),

            averageRating: driver.getAverageRating(),

            completedTrips: driver.getCompletedTrips(),
            
            bankId: driver.getBankId()
        };

    }

}