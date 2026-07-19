import { DriverResponse } from "../dto/DriverResponse";
import { UpdateDriverStatusRequest } from "../dto/UpdateDriverStatusRequest";
import { IDriverRepository } from "../ports/IDriverRepository";
import { IEmergencyContactRepository } from "../ports/IEmergencyContactRepository";
import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";

const MINIMO_CONTACTOS_EMERGENCIA_PARA_APROBAR = 2;

/**
 * ============================================================
 * UpdateDriverStatusUseCase
 * ============================================================
 *
 * RN-028: un chofer solo puede pasar a APROBADO si tiene, para
 * ese momento, al menos 2 contactos de emergencia ACTIVOS
 * registrados (ver EmergencyContact / IEmergencyContactRepository).
 *
 * ============================================================
 */
export class UpdateDriverStatusUseCase {

    constructor(
        private readonly driverRepository: IDriverRepository,
        private readonly emergencyContactRepository: IEmergencyContactRepository
    ) {}

    async execute(
        request: UpdateDriverStatusRequest
    ): Promise<DriverResponse> {

        const driver = await this.driverRepository.findByUserId(request.userId);

        if (!driver) {
            throw new Error("Driver not found.");
        }

        // RN-028: gate exclusivo de la transición hacia APROBADO.
        if (request.status === ApprovalStatus.APROBADO) {
            const activeContacts = await this.emergencyContactRepository.countActiveByDriverUserId(request.userId);

            if (activeContacts < MINIMO_CONTACTOS_EMERGENCIA_PARA_APROBAR) {
                throw new Error(
                    `Driver needs at least ${MINIMO_CONTACTOS_EMERGENCIA_PARA_APROBAR} active emergency contacts to be approved (currently has ${activeContacts}).`
                );
            }
        }

        driver.changeStatus(request.status);

        const updatedDriver = await this.driverRepository.update(driver);

        return {
            userId: updatedDriver.getUserId(),
            licenseNumber: updatedDriver.getLicenseNumber().getValue(),
            status: updatedDriver.getStatus(),
            averageRating: updatedDriver.getAverageRating(),
            completedTrips: updatedDriver.getCompletedTrips(),
            bankId: updatedDriver.getBankId() // <-- AQUÍ AGREGAMOS NUESTRO APORTE DEL BANCO
        };
    }
}