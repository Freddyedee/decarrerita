import { ApprovalStatus } from "../../domain/enums/ApprovalStatus";

export interface UpdateDriverStatusRequest {

    userId: number;

    status: ApprovalStatus;

}