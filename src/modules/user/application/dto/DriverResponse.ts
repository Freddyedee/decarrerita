import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";

export interface DriverResponse {

    userId: number;

    licenseNumber: string;

    status: ApprovalStatus;

    averageRating: number;

    completedTrips: number | null;

    bankId: number | null; //

}