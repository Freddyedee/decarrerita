import { ApprovalStatus } from "../enums/ApprovalStatus";

export class Driver {
    constructor(
        public readonly userId: string,
        private licenseNumber: string,
        private approved: ApprovalStatus,
        private averageRating: number,
        private completedTrips: number
    ) {}

    public approve(): void {
        this.approved = ApprovalStatus.APROBADO;
    }

    public revokeApproval(): void {
        this.approved = ApprovalStatus.RECHAZADO;
    }

    public updateLicense(
        licenseNumber: string,
    ): void {
        this.licenseNumber = licenseNumber;
    }

    public updateAverageRating(rating: number): void {
        if (rating < 0 || rating > 5) {
            throw new Error("Invalid rating.");
        }

        this.averageRating = rating;
    }

    public incrementCompletedTrips(): void {
        this.completedTrips++;
    }

    getLicenseNumber(): string {
        return this.licenseNumber;
    }

    isApproved(): boolean {
        return this.approved === ApprovalStatus.APROBADO;
    }

    getAverageRating(): number {
        return this.averageRating;
    }

    getCompletedTrips(): number {
        return this.completedTrips;
    }
}