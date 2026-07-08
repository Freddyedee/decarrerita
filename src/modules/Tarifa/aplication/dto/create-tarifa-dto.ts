// application/dto/create-tarifa-dto.ts
export interface CreateTarifaDTO {
    precioKm: number;
    tarifaBase: number;
    tarifaCancelacion: number;
    porcentajeComision: number;
}
