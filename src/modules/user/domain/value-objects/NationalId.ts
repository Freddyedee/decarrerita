export class NationalId {
    private constructor(
        private readonly nationalId: string
    ) {}

    public static create(id: string): NationalId {
        const normalized = id
            .trim()
            .toUpperCase()
            .replace(/\s+/g, "");

        if (normalized.length < 5 || normalized.length > 20) {
            throw new Error("Invalid national identification.");
        }

        if (!/^[A-Z0-9-]+$/.test(normalized)) {
            throw new Error("Invalid national identification.");
        }

        return new NationalId(normalized);
    }

    public getValue(): string {
        return this.nationalId;
    }

    public equals(other: NationalId): boolean {
        return this.nationalId === other.nationalId;
    }
}