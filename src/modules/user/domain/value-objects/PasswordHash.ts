export class PasswordHash {
    private constructor(
        private readonly hash: string
    ) {}

    public static create(hash: string): PasswordHash {
        const normalized = hash.trim();

        if (!normalized) {
            throw new Error("Password hash cannot be empty.");
        }

        if (normalized.length < 20) {
            throw new Error("Invalid password hash.");
        }

        return new PasswordHash(normalized);
    }

    public getValue(): string {
        return this.hash;
    }

    public equals(other: PasswordHash): boolean {
        return this.hash === other.hash;
    }
}