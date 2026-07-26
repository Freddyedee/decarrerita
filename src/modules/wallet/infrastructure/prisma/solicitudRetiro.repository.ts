import { prisma } from "@/shared/lib/prisma";
import { 
  ISolicitudRetiroRepository, 
  SolicitudRetiroInput 
} from "../../domain/ports/ISolicitudRetiroRepository";
import { Prisma } from "@prisma/client";

export class PrismaSolicitudRetiroRepository implements ISolicitudRetiroRepository {
  
  async create(data: SolicitudRetiroInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.solicitud_retiro.create({
      data: {
        id_wallet: data.walletId,
        id_banco: data.bancoId,
        monto: data.monto,
        numero_cuenta: data.numeroCuenta,
        titular_cuenta: data.titularCuenta,
        estado: data.estado || "PENDIENTE",
      },
    });
  }

  async findById(id: number, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.solicitud_retiro.findUnique({
      where: { id_retiro: id }, // <-- Exactamente id_retiro como en tu esquema
      include: { wallet: true, banco: true },
    });
  }

  async findByWalletId(walletId: number) {
    return await prisma.solicitud_retiro.findMany({
      where: { id_wallet: walletId },
      include: { banco: true },
      orderBy: { fecha_solicitud: "desc" },
    });
  }

  async findPendientes() {
    return await prisma.solicitud_retiro.findMany({
      where: { estado: "PENDIENTE" },
      include: {
        banco: true,
        wallet: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: { fecha_solicitud: "asc" },
    });
  }

  async updateEstado(
    id: number, 
    nuevoEstado: string, 
    tx?: Prisma.TransactionClient
  ) {
    const client = tx ?? prisma;
    return await client.solicitud_retiro.update({
      where: { id_retiro: id },
      data: {
        estado: nuevoEstado,
        fecha_procesamiento: new Date(), // <-- Exactamente fecha_procesamiento
      },
    });
  }
}