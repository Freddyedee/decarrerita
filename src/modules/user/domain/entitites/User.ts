import { Email } from "../value-objects/Email";
import { PasswordHash } from "../value-objects/PasswordHash";
import { UserRole } from "../enums/UserRole";
import { UserStatus } from "../enums/UserStatus";
import { PersonName, Phone } from "../value-objects";

export class User {

    constructor(
        readonly userid: number | null,
        private role: UserRole,
        private userFirstName: PersonName,
        private userLastName: PersonName,
        private email: Email,
        private phone: Phone,
        private passwordHash: PasswordHash,
        private status: UserStatus,
        readonly createdAt: Date,
    ) {}

    activate() {

        if (this.status === UserStatus.SUSPENDIDO) {
            throw new Error("Deleted users cannot be activated.");
        }

        this.status = UserStatus.ACTIVO;

    }

    suspend() {

        if (this.status !== UserStatus.ACTIVO) {
            throw new Error("Only active users can be suspended.");
        }

        this.status = UserStatus.SUSPENDIDO;

    }

    block() {

        if (this.status === UserStatus.DELETED) {
            throw new Error("Deleted users cannot be blocked.");
        }

        this.status = UserStatus.BLOCKED;

    }

    delete() {

        this.status = UserStatus.DELETED;

    }


    changePassword(
        newHash: PasswordHash
    ) {

        this.passwordHash = newHash;

    }

    changeEmail(
        newEmail: Email
    ) {

        this.email = newEmail;
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

    isActive() {
        return this.status === UserStatus.activo;
    }

    isBlocked() {
        return this.status === UserStatus.inactivo;
    }

    isDeleted() {
        return this.status === UserStatus.suspendido;
    }

}