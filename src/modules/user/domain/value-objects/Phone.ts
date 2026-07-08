export class Phone {
    private constructor(
        private readonly phone: string
    ) {}

    public static create(phone: string): Phone {
        const normalized = phone
            .trim()
            .replace(/\s+/g, "");

        if (!/^\+?[0-9]{8,15}$/.test(normalized)) {
            throw new Error("Invalid phone number.");
        }

        return new Phone(normalized);
    }

    public getValue(): string {
        return this.phone;
    }

    public equals(other: Phone): boolean {
        return this.phone === other.phone;
    }
}