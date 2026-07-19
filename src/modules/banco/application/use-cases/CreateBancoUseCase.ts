// src/modules/banco/application/use-cases/CreateBancoUseCase.ts

import { Banco } from '../../domain/entities/Banco';
import { IBancoRepository } from '../../domain/repositories/IBancoRepository';
import { CreateBancoDTO } from '../DTO/CreateBancoDto';

/**
 * Caso de Uso: Crear Banco
 * Responsabilidad: Orquestar el flujo para registrar un nuevo banco en el catálogo.
 * Valida reglas de negocio (Invariantes de dominio) antes de la persistencia.
 */
export class CreateBancoUseCase {
  
  // Inyección de Dependencias: Recibimos el contrato (interfaz), no la implementación exacta.
  constructor(private readonly bancoRepository: IBancoRepository) {}

  public async execute(dto: CreateBancoDTO): Promise<Banco> {
    
    // 1. Validaciones básicas de formato
    if (!dto.codigo_banco || dto.codigo_banco.length !== 4) {
      throw new Error("El código del banco es requerido y debe tener 4 caracteres (Ej: '0102').");
    }
    if (!dto.nombre_banco) {
      throw new Error("El nombre del banco es requerido.");
    }

    // 2. Regla de Negocio: No pueden existir dos bancos con el mismo código.
    /* 
     * Aunque por debajo el repositorio usa Prisma (findUnique) o SQL (SELECT ... WHERE codigo_banco = $1),
     * a esta capa no le importa CÓMO se busca, solo le importa el resultado.
     */
    const bancoExistente = await this.bancoRepository.findByCodigo(dto.codigo_banco);
    
    if (bancoExistente) {
      throw new Error(`Ya existe un banco registrado con el código ${dto.codigo_banco}.`);
    }

    // 3. Creación de la Entidad de Dominio
    // Convertimos el DTO "plano" en un objeto rico del Dominio
    const nuevoBanco = new Banco(
      dto.codigo_banco,
      dto.nombre_banco,
      dto.activo !== undefined ? dto.activo : true 
    );

    // Ejecutamos validaciones internas propias de la entidad
    nuevoBanco.validate();

    // 4. Persistencia a través del Puerto
    /* 
     * Aquí le decimos al repositorio: "Guarda esto". 
     * Por debajo, el BancoRepository (el adaptador) traducirá esto a una consulta:
     * INSERT INTO banco (codigo_banco, nombre_banco, estado) VALUES (...)
     */
    return await this.bancoRepository.save(nuevoBanco);
  }
}