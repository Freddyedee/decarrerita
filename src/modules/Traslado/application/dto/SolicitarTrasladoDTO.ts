export interface SolicitarTrasladoDTO{
    clienteId: number, 
    origenLat: number,
    origenlng: number, 
    destinolat: number,
    destinolng: number,
    distanciaEstimadaKm: number; 
}