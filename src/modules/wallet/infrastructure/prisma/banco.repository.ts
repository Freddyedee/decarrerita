// src/modules/wallet/infrastructure/prisma/banco.repository.ts

import { prisma } from "@/shared/lib/prisma";
import { IBancoRepository } from "../../domain/ports/IBancoRepository";
import { Banco } from "../../domain/entities/Banco";

export class BancoRepository implements IBancoRepository {
  async findAllActive(): Promise<Banco[]> {
    const bancos = await prisma.banco.findMany({
      where: { activo: true },
      orderBy: { id_banco: "asc" },
    });

    return bancos.map(
        (b) => new Banco(b.id_banco, b.nombre_banco, b.codigo_banco, b.activo)
    );
  }

  async findById(id: number): Promise<Banco | null> {
    const b = await prisma.banco.findUnique({
      where: { id_banco: id },
    });

    if (!b) return null;

    return new Banco(b.id_banco, b.nombre_banco, b.codigo_banco, b.activo);
  }
}