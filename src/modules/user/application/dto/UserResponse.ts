
export interface UserResponse {
    user_id: number | null;
    role: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: Date;
}