export interface SolicitarTrasladoDTO{
    clienteId: number, 
    origenlat: number,
    origenlng: number, 
    destinolat: number,
    destinolng: number,
    distanciaEstimadaKm: number; 
}