// src/modules/banco/application/dtos/CreateBancoDTO.ts

/**
 * Data Transfer Object (DTO) para la creación de un Banco.
 * 
 * Propósito: Define el contrato estricto de los datos que esperamos recibir 
 * desde la capa de Presentación (Controlador HTTP / API Route).
 * Aislando a la capa de Aplicación de objetos complejos como un Request de Express o Next.js.
 */
export interface CreateBancoDTO {
  codigo_banco: string;
  nombre_banco: string;
  // El estado es opcional en el request, por defecto será 'activo'
  activo?: boolean; 
}