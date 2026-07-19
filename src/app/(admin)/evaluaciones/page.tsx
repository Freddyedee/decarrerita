import {prisma} from "@/shared/lib/prisma";
import { EvaluacionClient } from "./EvaluacionClient";

// Optimizamos la ruta para que siempre traiga datos frescos
export const dynamic = 'force-dynamic';

export default async function EvaluacionesPage() {
  // 1. Join Seguro: Traemos a los choferes, sus datos de usuario y su ÚLTIMA evaluación
  const choferes = await prisma.chofer.findMany({
    select: {
        id_usuario: true, 
        licencia: true, 
        estado_aprobacion: true, 
      usuario: {
        select: {
          nombre: true,
          apellido: true,
          email: true,
        }
      },
      evaluacion_psicologica: {
        orderBy: {
          fecha_evaluacion: 'desc'
        },
        take: 1, // Solo nos interesa la más reciente para mostrar en la tabla
        select: {
            calificacion: true, 
            resultado: true, 
            fecha_vencimiento: true, 
        }
      }
    },
    orderBy: {
      estado_aprobacion: 'asc' // Mostramos primero a los pendientes
    }
  });

  return (
    <main>
      {/* Pasamos los datos extraídos de la BD al componente de cliente */}
      <EvaluacionClient choferes={choferes} />
    </main>
  );
}