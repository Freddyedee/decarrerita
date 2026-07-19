import { ApprovalStatus } from "../enums/ApprovalStatus";
import { DriverLicense } from "../value-objects/DriverLicense";

export class Driver {
    constructor(
        public readonly userId: number,
        private licenseNumber: DriverLicense,
        private status: ApprovalStatus,
        private averageRating: number,
        private completedTrips: number | null,
        private bankId: number | null = null //
    ) {}

    changeStatus(
        status: ApprovalStatus
    ): void {

        this.status = status;
    }

    
    changeLicense(licenseNumber: DriverLicense): void {
        this.licenseNumber = licenseNumber;
    }

    changeMetrics(averageRating: number,completedTrips: number): void {

        if (averageRating < 0 || averageRating > 5) {
            throw new Error("Invalid average rating.");
        }

        if (completedTrips < 0) {
            throw new Error("Completed trips cannot be negative.");
        }

        this.averageRating = averageRating;
        this.completedTrips = completedTrips;

    }

    assignBank(bankId: number | null): void {
        this.bankId = bankId;
    }

    isApproved(): boolean {
        return this.status === ApprovalStatus.APROBADO;
    }

    getAverageRating(): number {
        return this.averageRating;
    }

    getCompletedTrips(): number | null {
        return this.completedTrips;
    }

    getStatus(): ApprovalStatus {
        return this.status;
    }

    getUserId(): number {
        return this.userId;
    }

    getLicenseNumber(): DriverLicense {
        return this.licenseNumber;
    }

    getBankId(): number | null {
        return this.bankId;
    }
}