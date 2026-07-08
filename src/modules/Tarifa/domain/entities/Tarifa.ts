export class Tarifa {

    constructor(

        public readonly id: number, 
        public readonly precioKm: number, 
        public readonly tarifaBase: number, 
        public readonly tarifaCancelacion: number, 
        public readonly porcentajeComision: number, 
        public readonly fechaInicioVigencia: Date, 
        public readonly fechaFinVigencia: Date | null, 
    
    ){}


    isVigente(referenceDate: Date = new Date()): boolean {
        const started = referenceDate >= this.fechaInicioVigencia;
        const notEnded = this.fechaFinVigencia === null || referenceDate <= this.fechaFinVigencia;
        return started && notEnded;
    }

    calcularCosto(distanciaKm: number): number {
        return this.tarifaBase + (this.precioKm * distanciaKm);
    }

    calcularReparto(costoTotal: number): { comisionEmpresa: number; pagoChofer: number } {
        const comisionEmpresa = costoTotal * (this.porcentajeComision / 100);
        return { comisionEmpresa, pagoChofer: costoTotal - comisionEmpresa };
    }

    /**
     * Penalización aplicada cuando cliente o chofer
     * cancelan un traslado ya asignado.
     */
    calcularPenalizacionCancelacion(): number {
        return this.tarifaCancelacion;
    }


}