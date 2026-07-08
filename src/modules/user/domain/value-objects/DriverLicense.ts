export class LicenseNumber {
    private constructor(
        private readonly license: string
    ) {}

    public static create(license: string): LicenseNumber {
        const normalized = license
            .trim()
            .toUpperCase()
            .replace(/\s+/g, "");

        if (normalized.length < 5 || normalized.length > 25) {
            throw new Error("Invalid license number.");
        }

        if (!/^[A-Z0-9-]+$/.test(normalized)) {
            throw new Error("Invalid license number.");
        }

        return new LicenseNumber(normalized);
    }

    public value(): string {
        return this.license;
    }

    public equals(other: LicenseNumber): boolean {
        return this.license === other.license;
    }
}