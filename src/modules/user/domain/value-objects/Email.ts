export class Email {

    private constructor(
        private readonly value: string
    ) {}

    static create(email: string): Email {

        const normalized = email.trim().toLowerCase();

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(normalized)) {
            throw new Error("Invalid email.");
        }

        return new Email(normalized);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

}