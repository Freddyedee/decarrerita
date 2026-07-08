import { Email } from "../value-objects/Email";
import { PasswordHash } from "../value-objects/PasswordHash";
import { UserRole } from "../enums/UserRole";
import { UserStatus } from "../enums/UserStatus";
import { PersonName, Phone } from "../value-objects";

export class User {

    constructor(
        readonly userid: number,
        private role: UserRole,
        private userFirstName: PersonName,
        private userLastName: PersonName,
        private email: Email,
        private phone: Phone,
        private passwordHash: PasswordHash,
        private status: UserStatus,
        readonly createdAt: Date,
    ) {}

    changeProfile(firstName: PersonName,
                    lastName: PersonName,
                    email: Email,
                    phone: Phone,
                    passwordHash: PasswordHash): void {
    this.userFirstName = firstName;
    this.userLastName = lastName;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    }

    changeStatus(status: UserStatus): void {
    this.status = status;
    }   

    getFirstName() {
        return this.userFirstName;
    }

    getLastName() {
        return this.userLastName;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return this.role;
    }

    getPhone() {
        return this.phone;
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    getStatus() {
        return this.status;
    }

    getUserId(): number | null {
    return this.userid;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

}