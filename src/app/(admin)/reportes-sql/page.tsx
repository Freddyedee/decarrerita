// src/app/(admin)/reportes-sql/page.tsx
import ConsultasClient from './ConsultasClient'

export const metadata = {
  title: 'Consultas SQL | Evaluación',
}

export default function ReportesSqlPage() {
  return (
    <div className="w-full h-full min-h-screen">
      <ConsultasClient />
    </div>
  )
}