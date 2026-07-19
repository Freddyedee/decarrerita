// src/modules/banco/infrastructure/prisma/BancoRepository.ts

import { PrismaClient, banco as PrismaBancoModel } from '@prisma/client';
import { IBancoRepository } from '../../domain/repositories/IBancoRepository';
import { Banco } from '../../domain/entities/Banco';


const prisma = new PrismaClient();

/**
 * Adaptador de Infraestructura: BancoRepository
 * Implementa el contrato IBancoRepository utilizando Prisma ORM.
 */
export class BancoRepository implements IBancoRepository {
  
  public async save(banco: Banco): Promise<Banco> {
    // Si la entidad tiene ID, es una actualización (UPDATE).
    if (banco.id_banco) {
      /* 
       * ==========================================
       * EQUIVALENTE EN SQL (PostgreSQL):
       * ==========================================
       * UPDATE banco 
       * SET codigo_banco = $1, nombre_banco = $2, estado = $3 
       * WHERE id_banco = $4
       * RETURNING *;
       * ------------------------------------------
       * Nota para la defensa: Prisma usa "RETURNING *" por defecto en PostgreSQL 
       * para devolverte el registro actualizado en la misma consulta, 
       * evitando tener que hacer un SELECT posterior.
       */
      const updated = await prisma.banco.update({
        where: { id_banco: banco.id_banco },
        data: {
          codigo_banco: banco.codigo_banco,
          nombre_banco: banco.nombre_banco,
          activo: banco.activo,
        }
      });
      return this.toDomain(updated);
    }

    // Si no tiene ID, es una creación nueva (INSERT).
    /* 
     * ==========================================
     * EQUIVALENTE EN SQL (PostgreSQL):
     * ==========================================
     * INSERT INTO banco (codigo_banco, nombre_banco, estado) 
     * VALUES ($1, $2, $3)
     * RETURNING id_banco, codigo_banco, nombre_banco, estado;
     */
    const created = await prisma.banco.create({
      data: {
        codigo_banco: banco.codigo_banco,
        nombre_banco: banco.nombre_banco,
        activo: banco.activo,
      }
    });
    return this.toDomain(created);
  }

  public async findById(id_banco: number): Promise<Banco | null> {
    /* 
     * ==========================================
     * EQUIVALENTE EN SQL:
     * ==========================================
     * SELECT id_banco, codigo_banco, nombre_banco, estado 
     * FROM banco 
     * WHERE id_banco = $1 
     * LIMIT 1;
     */
    const banco = await prisma.banco.findUnique({
      where: { id_banco }
    });
    return banco ? this.toDomain(banco) : null;
  }

  public async findByCodigo(codigo: string): Promise<Banco | null> {
    /* 
     * ==========================================
     * EQUIVALENTE EN SQL:
     * ==========================================
     * SELECT id_banco, codigo_banco, nombre_banco, estado 
     * FROM banco 
     * WHERE codigo_banco = $1 
     * LIMIT 1;
     * ------------------------------------------
     * Nota: EstO rápido porque 'codigo_banco' tiene un índice 
     * UNIQUE (creado en la migración).
     */
    const banco = await prisma.banco.findUnique({
      where: { codigo_banco: codigo }
    });
    return banco ? this.toDomain(banco) : null;
  }

  public async findAll(): Promise<Banco[]> {
    /* 
     * ==========================================
     * EQUIVALENTE EN SQL:
     * ==========================================
     * SELECT id_banco, codigo_banco, nombre_banco, estado 
     * FROM banco 
     * ORDER BY nombre_banco ASC;
     */
    const bancos = await prisma.banco.findMany({
      orderBy: { nombre_banco: 'asc' }
    });
    return bancos.map(banco => this.toDomain(banco));
  }

  /**
   * Método Helper: Mapea el modelo de Prisma (Base de datos) 
   * hacia la Entidad de Dominio pura.
   */
  private toDomain(prismaBanco: PrismaBancoModel): Banco {
    return new Banco(
      prismaBanco.codigo_banco,
      prismaBanco.nombre_banco,
      prismaBanco.activo
    );
  }
}