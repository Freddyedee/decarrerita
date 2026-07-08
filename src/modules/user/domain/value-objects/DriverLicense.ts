export class DriverLicense
 {
    private constructor(
        private readonly license: string
    ) {}

    public static create(license: string): DriverLicense
     {
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

        return new DriverLicense
        (normalized);
    }

    public getValue(): string {
        return this.license;
    }

    public equals(other: DriverLicense): boolean {
        return this.license === other.license;
    }
}