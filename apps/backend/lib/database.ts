import { PrismaClient } from '@prisma/client'


declare global {

  var prismaClient: PrismaClient | undefined

}

const prismaClient = new PrismaClient()



export const prisma = global.prismaClient || prismaClient


if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClient = prismaClient
  
}
