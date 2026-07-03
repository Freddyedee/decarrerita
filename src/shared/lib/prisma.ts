import { PrismaClient } from '../../../app/generated/prisma'

const globalForPrisma = global as unknown as {

    prisma: PrismaClient | undefined

}

/**
 * Prisma Singleton 
 * Proposito: Evitar multiples conexiones con la base datos en desarrollo (Next.js / hot reload) 
 */

export const prisma = 
    globalForPrisma.prisma ?? 
    new PrismaClient({log:['error', 'query','warn'],})

/*instancia guardado globalmente*/

if(process.env.NODE_ENV !== 'production'){
    globalForPrisma.prisma = prisma
}


