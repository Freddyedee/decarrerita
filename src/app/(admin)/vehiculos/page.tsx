import {prisma} from "@/shared/lib/prisma";
import { VehiculoClient } from "./VehiculoClient";

// Le indica a Next.js que NO guarde esta página en caché estática. 
// Cada vez que un usuario entra, obligamos al sistema a ir a PostgreSQL por los datos más frescos.
export const dynamic = 'force-dynamic';

export default async function VehiculosPage() {
  
  // Consulta a la base de datos usando Prisma. Equivalente a un SELECT con varios JOINs.
  const vehiculos = await prisma.vehiculo.findMany({
    
    // Usamos 'select' en lugar de 'include' para traer ESTRICTAMENTE las columnas necesarias.
    // Esto optimiza el ancho de banda y evita errores con tipos de datos complejos (como Decimal).
    select: {
      id_vehiculo: true, // Primary Key
      placa: true,
      modelo: true,
      estado: true,
      
      // JOIN (Relación) con la tabla chofer
      chofer: {
        select: {
          // JOIN (Relación anidada) con la tabla usuario para traer sus nombres
          usuario: {
            select: {
              nombre: true,
              apellido: true,
            }
          }
        }
      },
      
      // JOIN (Relación) con la tabla revision_vehicular
      revision_vehicular: {
        // Ordenamos de forma descendente por fecha para tener la más reciente de primera.
        orderBy: {
          fecha_revision: 'desc'
        },
        // 'take: 1' equivale a LIMIT 1 en SQL. Solo traemos la última revisión.
        take: 1, 
        select: {
          calificacion: true,
          resultado: true,
          fecha_vencimiento: true,
        }
      }
    },
    // Ordenamos la lista principal de vehículos para que los más nuevos salgan arriba.
    orderBy: {
      id_vehiculo: 'desc'
    }
  });

  return (
    <main>
      {/* Pasamos el array de datos limpios obtenidos de la BD al componente visual */}
      <VehiculoClient vehiculos={vehiculos} />
    </main>
  );
}