import { UpdateDriverMetricsUseCase } from "../../application/use-cases/UpdateDriverMetricsUseCase";
import { UpdateDriverStatusUseCase } from "../../application/use-cases/UpdateDriverStatusUseCase";
import { UpdateDriverLicenseUseCase } from "../../application/use-cases/UpdateDriverLicenseUseCase";
import { GetDriverByIdUseCase } from "../../application/use-cases/GetDriverByIdUseCase";

import { UpdateDriverMetricsRequest } from "../../application/dto/UpdateDriverMetricsRequest";
import { UpdateDriverStatusRequest } from "../../application/dto/UpdateDriverStatusRequest";
import { UpdateDriverLicenseRequest } from "../../application/dto/UpdateDriverLicenseRequest";

import { DriverResponse } from "../../application/dto/DriverResponse";

export class DriverController {

    constructor(

        private readonly updateDriverMetricsUseCase: UpdateDriverMetricsUseCase,

        private readonly updateDriverStatusUseCase: UpdateDriverStatusUseCase,

        private readonly updateDriverLicenseUseCase: UpdateDriverLicenseUseCase,

        private readonly getDriverByIdUseCase: GetDriverByIdUseCase

    ) {}

    async getById(userId: number): Promise<DriverResponse> {

        return await this.getDriverByIdUseCase.execute(userId);

    }

    async updateMetrics(
        request: UpdateDriverMetricsRequest
    ): Promise<DriverResponse> {

        return await this.updateDriverMetricsUseCase.execute(request);

    }

    async updateStatus(
        request: UpdateDriverStatusRequest
    ): Promise<DriverResponse> {

        return await this.updateDriverStatusUseCase.execute(request);

    }

    async updateLicense(
        request: UpdateDriverLicenseRequest
    ): Promise<DriverResponse> {

        return await this.updateDriverLicenseUseCase.execute(request);

    }

}