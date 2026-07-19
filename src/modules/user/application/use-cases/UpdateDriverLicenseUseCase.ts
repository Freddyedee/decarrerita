import { DriverLicense } from "../../domain/value-objects/DriverLicense";
import { DriverResponse } from "../dto/DriverResponse";
import { UpdateDriverLicenseRequest } from "../dto/UpdateDriverLicenseRequest";
import { IDriverRepository } from "../ports/IDriverRepository";

export class UpdateDriverLicenseUseCase {

    constructor(
        private readonly driverRepository: IDriverRepository
    ) {}

    async execute(
        request: UpdateDriverLicenseRequest
    ): Promise<DriverResponse> {

        const driver =
            await this.driverRepository.findByUserId(
                request.userId
            );

        if (!driver) {
            throw new Error("Driver not found.");
        }

        const license =
            DriverLicense.create(request.licenseNumber);

        driver.changeLicense(license);

        const updatedDriver =
            await this.driverRepository.update(driver);

        return {

            userId: updatedDriver.getUserId(),

            licenseNumber:
                updatedDriver.getLicenseNumber().getValue(),

            status:
                updatedDriver.getStatus(),

            averageRating:
                updatedDriver.getAverageRating(),

            completedTrips:
                updatedDriver.getCompletedTrips(),

            bankId: updatedDriver.getBankId(), 

        };

    }

}