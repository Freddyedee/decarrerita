export class PersonName {
    private constructor(
        private readonly name: string
    ) {}

    public static create(name: string): PersonName {
        const normalized = name
            .trim()
            .replace(/\s+/g, " ");

        if (normalized.length < 2) {
            throw new Error("Name is too short.");
        }

        if (normalized.length > 80) {
            throw new Error("Name is too long.");
        }

        if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(normalized)) {
            throw new Error("Invalid name.");
        }

        return new PersonName(normalized);
    }

    public getValue(): string {
        return this.name;
    }

    public equals(other: PersonName): boolean {
        return this.name === other.name;
    }
}