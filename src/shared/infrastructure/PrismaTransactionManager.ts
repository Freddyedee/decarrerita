import { prisma } from "@/shared/lib/prisma"
import { ITransactionManager } from "../domain/ITransactionManager"
import { Prisma } from "@prisma/client"

export class PrismaTransactionManager implements ITransactionManager {

    async run<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise <T>{
        return prisma.$transaction(callback); 
    }
}