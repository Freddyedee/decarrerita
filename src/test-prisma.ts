import { prisma } from './shared/lib/database/prisma'

async function main() {
  // 1. Obtener los primeros 5 registros de cualquier tabla
  const datos = await prisma.historial_estado_traslado.findMany({
    take: 5
  })
  
  console.log("Datos obtenidos:", datos)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())


