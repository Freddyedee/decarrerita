export class Phone {
    private constructor(
        private readonly phone: string
    ) {}

    public static create(raw?: string): Phone {
        // 🛡️ GUARDIA DE SEGURIDAD: Evita el error 'reading replace of undefined'
        if (!raw || typeof raw !== "string") {
            throw new Error("El número de teléfono es obligatorio y debe ser texto válido.");
        }

        // Ahora sí es 100% seguro usar .replace()
        const normalized = raw.replace(/[\s\-\(\)\.]/g, "");

        if (!/^\+?[0-9]{3,15}$/.test(normalized)) {
            throw new Error(`Invalid phone number format: ${raw}`);
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