import { InspectionResult } from "../enum/InspectionResult";

export class RevisionVehicular {


    private static readonly MIN_APPROVAL_SCORE = 65; 
    private static readonly VALID_DAYS = 365; 

    constructor (
        public readonly id: number, 
        public readonly vehicleId: number, 
        public readonly score: number, 
        public readonly date: Date, 
        public readonly observations: string, 
        public readonly expirationDate: Date
    ){}

    /**
     * Calcula la fecha de vencimiento a partir de la fecha
     * en que se realizó la revisión. Las revisiones son
     * válidas por un año, según el planteamiento del negocio.
     */

    static calculateExpirationDate( revisionDate: Date): Date {

        const expiration = new Date(revisionDate); 
        expiration.setDate(expiration.getDate() + RevisionVehicular.VALID_DAYS); 
        return expiration; 
    }


    /**
     * Determina si la calificación obtenida es suficiente
     * para considerar el vehículo apto.
     */

     passedInspection(): boolean {
        return this.score >= RevisionVehicular.MIN_APPROVAL_SCORE;
    }

    /*
    El resultado no se almacena como decision manual, es derivado de una calificación
    */ 

    getResult(): InspectionResult {

        return this.passedInspection() ? InspectionResult.APPROVED : InspectionResult.REJECTED; 
    }

    /**
     * Determina si esta revisión ya venció, dada una fecha
     * de referencia (por defecto, ahora mismo).
     */

    isExpired(referenceDate: Date = new Date()) : boolean { 
        return referenceDate.getTime() > this.expirationDate.getTime(); 
    }

    /**
     * Una revision es valida solo si fue aprobada y todavia no ha vencido
     */

    isValid(referenceDate: Date = new Date()) : boolean {
        return this.passedInspection() && !this.isExpired(referenceDate); 
    }




}