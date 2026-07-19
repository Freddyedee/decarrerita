/**
 * 
 * El Dominio (los casos de uso) no debe depender de Prisma. Depende de este "contrato" (Interfaz). 
 * Luego, Prisma se "enchufa" a este contrato. Esto permite que durante los tests puedas crear un 
 * "MockBancoRepository" que no toque la base de datos real.
 */

import { Banco } from "../entities/Banco";

/**
 * Puerto de Salida (Output Port): IBancoRepository
 * Define las operaciones que el sistema necesita realizar sobre los bancos.
 * Cualquier tecnología de persistencia (Prisma, TypeORM, MongoDB) debe cumplir este contrato.
 */
export interface IBancoRepository {
  // Guarda un nuevo banco o actualiza uno existente
  save(banco: Banco): Promise<Banco>;
  
  // Obtiene un banco por su ID
  findById(id_banco: number): Promise<Banco | null>;
  
  // Obtiene un banco por su código (Ej: "0102" para Banco de Venezuela)
  findByCodigo(codigo: string): Promise<Banco | null>;
  
  // Lista todos los bancos (ideal para llenar los combobox/selects en el Frontend)
  findAll(): Promise<Banco[]>;
}