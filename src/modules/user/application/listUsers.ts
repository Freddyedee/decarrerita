import { prisma } from '@infra/prisma/client'

export const listUsers = async  () => { return await prisma.usuario.findMany();};