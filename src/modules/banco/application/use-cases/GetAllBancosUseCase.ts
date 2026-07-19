// src/modules/banco/application/use-cases/GetAllBancosUseCase.ts

import { Banco } from '../../domain/entities/Banco';
import { IBancoRepository } from '../../domain/repositories/IBancoRepository';

/**
 * Caso de Uso: Listar Todos los Bancos
 * Responsabilidad: Obtener el catálogo completo de bancos registrados, 
 * típicamente usado para poblar listas desplegables en interfaces de usuario.
 */
export class GetAllBancosUseCase {
  
  constructor(private readonly bancoRepository: IBancoRepository) {}

  public async execute(): Promise<Banco[]> {
    /* 
     * Delegamos la obtención de datos al repositorio.
     * En infraestructura, esto se traduce a: SELECT * FROM banco ORDER BY nombre_banco ASC;
     */
    const bancos = await this.bancoRepository.findAll();
    
    // Si necesitas aplicar filtros o lógica (ej. excluir bancos inactivos para ciertos usuarios),
    // esta capa es el lugar correcto para hacerlo, sin modificar la consulta SQL base.
    
    return bancos;
  }
}