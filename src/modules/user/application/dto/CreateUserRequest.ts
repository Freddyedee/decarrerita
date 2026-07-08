
export interface CreateUserRequest {
    role: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
}