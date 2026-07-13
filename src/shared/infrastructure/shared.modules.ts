// shared/infrastructure/shared.modules.ts
//
// Composition Root para piezas de infraestructura que no
// pertenecen a ningún módulo de negocio específico — son
// utilidades transversales (por ahora, solo el manejo de
// transacciones atómicas de Prisma).

import { PrismaTransactionManager } from "./PrismaTransactionManager";

export const transactionManager = new PrismaTransactionManager();