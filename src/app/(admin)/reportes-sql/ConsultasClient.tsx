'use client'

import { useState } from 'react'
import {
  fetchUsuariosAdministrativos,
  fetchGananciasEmpresa,
  fetchChoferesYVehiculosAptos,
  fetchTrasladosChofer,
  fetchPagadoAChofer,
  fetchPerfilChofer,
  fetchHistorialRecargasCliente,
  fetchHistorialViajesCliente,
  fetchDetalleTrasladoCliente,
  fetchAuditoriaGeneral,
  fetchSaldosWallets,
  fetchTodosLosUsuarios,
  fetchTrasladosCanceladosChofer
} from './actions'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ConsultaData {
  titulo: string
  descripcion: string
  justificacion: string
  inputs?: { name: string; label: string; type: string; defaultValue?: string }[]
  fetchFn: (params?: Record<string, string>) => Promise<any>
}

export default function ConsultasClient() {
  const [activeTab, setActiveTab] = useState('administrativo')

  const tabs = [
    { id: 'usuarios', label: 'Usuarios Generales' },
    { id: 'administrativo', label: 'Administrativo' },
    { id: 'chofer', label: 'Chofer' },
    { id: 'cliente', label: 'Cliente' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">Panel de Consultas SQL</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Módulo exclusivo para la auditoría y evaluación de sentencias SQL puras exigidas en el proyecto.
        </p>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-1 text-sm font-medium transition-all duration-200
                border-b-2 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido dinámico */}
      <div className="mt-6">
        {activeTab === 'administrativo' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ConsultaCard
              consulta={{
                titulo: 'Ganancias Netas de la Empresa',
                descripcion: 'Calcula lo recaudado por la empresa (30% del precio de cada traslado) para todos los viajes completados.',
                justificacion:
                  "Se consulta directamente la tabla 'traslado' filtrando por estado 'COMPLETADO'. Se utiliza la función de agregación SUM() multiplicada por 0.30 para extraer el 30% exacto que corresponde a la empresa, cumpliendo con la regla de negocio del documento.",
                fetchFn: fetchGananciasEmpresa,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Listado de Personal Administrativo',
                descripcion: 'Muestra todos los usuarios que tienen privilegios de administración en el sistema.',
                justificacion:
                  "Se implementó un INNER JOIN entre las tablas 'usuario' y 'rol'. Esto es necesario porque la tabla usuario solo almacena la clave foránea 'id_rol', y requerimos filtrar por el nombre en texto ('Administrador') que reside en la tabla rol.",
                fetchFn: fetchUsuariosAdministrativos,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Evaluaciones Aprobatorias (Choferes y Vehículos)',
                descripcion:
                  'Muestra los choferes y sus vehículos que han aprobado la evaluación psicológica (>= 73) y la revisión vehicular (>= 65).',
                justificacion:
                  "Se emplean múltiples INNER JOIN para conectar al chofer con el usuario (para el nombre), con sus evaluaciones psicológicas, con sus vehículos asignados y con las revisiones de dichos vehículos. Se aplican las restricciones en la cláusula WHERE exigidas en el requerimiento del proyecto.",
                fetchFn: fetchChoferesYVehiculosAptos,
              }}
            />
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ConsultaCard
              consulta={{
                titulo: 'Listado Maestro de Usuarios',
                descripcion: 'Muestra la totalidad de los usuarios registrados en el sistema, cruzados con su respectivo rol de acceso.',
                justificacion:
                  "Se aplica un INNER JOIN fundamental entre la tabla 'usuario' y la tabla 'rol'. Esto permite que el sistema muestre la etiqueta del rol ('Chofer', 'Cliente', 'Administrador') en lugar del número entero que representa el 'id_rol', cumpliendo con las normas de normalización de base de datos.",
                fetchFn: fetchTodosLosUsuarios,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Estado Global de Billeteras Virtuales',
                descripcion: 'Auditoría de todos los saldos disponibles y posibles bloqueos de cuentas en la plataforma.',
                justificacion:
                  "Se emplean dos INNER JOIN partiendo desde la tabla 'wallet' hacia 'usuario' y posteriormente hacia 'rol'. Esto permite a la administración monitorear el capital flotante del sistema y segmentarlo dependiendo de si el saldo pertenece a un cliente, un chofer o a la empresa misma.",
                fetchFn: fetchSaldosWallets,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Registro de Auditoría Administrativa',
                descripcion:
                  'Historial de las acciones críticas ejecutadas por los administradores sobre los registros del sistema.',
                justificacion:
                  "Se enlaza la tabla 'auditoria_administrativa' con la tabla 'usuario' utilizando el campo 'id_usuario_admin'. Esto resuelve la identidad del administrador que ejecutó la acción, brindando trazabilidad y seguridad sobre quién y cuándo modificó una entidad (como aprobar un chofer o un vehículo).",
                fetchFn: fetchAuditoriaGeneral,
              }}
            />
          </div>
        )}

        {activeTab === 'chofer' && (
  <div className="space-y-8 animate-in fade-in duration-300">
    <ConsultaCard
      consulta={{
        titulo: 'Historial de Traslados por Período',
        descripcion: 'Consulta de los traslados realizados por un chofer en un rango de fechas específico.',
        justificacion:
          "Se consulta la tabla 'traslado' filtrando directamente por la llave foránea 'id_chofer'. Para el periodo de tiempo, se utiliza la sentencia BETWEEN (o operadores >= y <=) sobre el campo 'fecha_solicitud'.",
        inputs: [
          { name: 'id_chofer', label: 'ID del Chofer', type: 'number', defaultValue: '3' },
          { name: 'fecha_inicio', label: 'Fecha Inicio', type: 'date', defaultValue: '2026-01-01' },
          { name: 'fecha_fin', label: 'Fecha Fin', type: 'date', defaultValue: '2026-12-31' },
        ],
        fetchFn: fetchTrasladosChofer,
      }}
    />
    
    <ConsultaCard
      consulta={{
        titulo: 'Perfil Completo del Chofer',
        descripcion: 'Muestra los datos personales, información bancaria y contactos de emergencia del chofer.',
        justificacion:
          "Se usa un INNER JOIN con 'usuario' para los datos base y LEFT JOIN con 'banco' y 'contacto_emergencia' para no descartar al chofer si aún no ha registrado su cuenta o contactos. Esto genera una fila por cada contacto registrado.",
        inputs: [{ name: 'id_chofer', label: 'ID del Chofer', type: 'number', defaultValue: '3' }],
        fetchFn: fetchPerfilChofer,
      }}
    />
    
    <ConsultaCard
      consulta={{
        titulo: 'Historial de Retiros y Pagos Cancelados al Chofer',
        descripcion: 'Muestra los pagos reales que la empresa le ha cancelado al chofer mediante retiros aprobados.',
        justificacion:
          "Se consultan las tablas 'solicitud_retiro', 'wallet' y 'banco', filtrando por el estado 'APROBADO'. Esto demuestra la trazabilidad real de los pagos según la lógica transaccional del sistema, en lugar de un simple cálculo matemático.",
        inputs: [
          { name: 'id_chofer', label: 'ID del Chofer', type: 'number', defaultValue: '3' },
          { name: 'fecha_inicio', label: 'Fecha Inicio', type: 'date', defaultValue: '2026-01-01' },
          { name: 'fecha_fin', label: 'Fecha Fin', type: 'date', defaultValue: '2026-12-31' },
        ],
        fetchFn: fetchPagadoAChofer,
      }}
    />

    <ConsultaCard
      consulta={{
        titulo: 'Traslados Cancelados por la Empresa',
        descripcion: 'Listado de los traslados asignados al chofer que fueron cancelados.',
        justificacion:
          "Se consulta la tabla 'traslado' filtrando por el ID del chofer y utilizando el operador LIKE '%CANCELADO%' en el estado_actual para capturar de forma flexible cualquier tipo de cancelación sin importar si proviene del admin o del sistema.",
        inputs: [{ name: 'id_chofer', label: 'ID del Chofer', type: 'number', defaultValue: '3' }],
        fetchFn: fetchTrasladosCanceladosChofer,
      }}
    />
  </div>
)}
        {activeTab === 'cliente' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ConsultaCard
              consulta={{
                titulo: 'Historial de Recargas de Saldo',
                descripcion: 'Muestra la fecha, referencia, banco y monto de todas las recargas realizadas por un cliente.',
                justificacion:
                  "Se enlaza la tabla 'recarga' con 'wallet' para llegar al usuario (cliente). Adicionalmente, se hace un INNER JOIN con 'banco' para traer el nombre legible de la entidad financiera y no solo el ID.",
                inputs: [{ name: 'id_cliente', label: 'ID del Cliente', type: 'number', defaultValue: '2' }],
                fetchFn: fetchHistorialRecargasCliente,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Historial General de Viajes',
                descripcion: 'Consulta de todos los traslados solicitados por el cliente, sin importar su estado final.',
                justificacion:
                  "Se aplican sentencias LEFT JOIN con 'chofer', 'usuario' y 'vehiculo'. Esto garantiza que si un viaje fue 'CANCELADO' antes de que se le asignara formalmente un chofer o vehículo, el registro del traslado siga apareciendo en el historial del cliente sin generar errores.",
                inputs: [{ name: 'id_cliente', label: 'ID del Cliente', type: 'number', defaultValue: '2' }],
                fetchFn: fetchHistorialViajesCliente,
              }}
            />
            <ConsultaCard
              consulta={{
                titulo: 'Detalles de Seguridad del Traslado Asignado',
                descripcion:
                  'Recupera la información del chofer y el vehículo asociado a un viaje específico para la seguridad del cliente.',
                justificacion:
                  "Se utilizan INNER JOIN estructurados para traer el nombre y teléfono de la tabla 'usuario', combinados con el modelo, color y placa de la tabla 'vehiculo'. Esto satisface la regla de negocio que exige proveer datos de identificación visual al cliente antes de abordar.",
                inputs: [{ name: 'id_traslado', label: 'ID del Traslado', type: 'number', defaultValue: '1' }],
                fetchFn: fetchDetalleTrasladoCliente,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Componente ConsultaCard rediseñado
function ConsultaCard({ consulta }: { consulta: ConsultaData }) {
  const [resultado, setResultado] = useState<any[] | null>(null)
  const [sqlActual, setSqlActual] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {}
    consulta.inputs?.forEach((input) => {
      initialState[input.name] = input.defaultValue || ''
    })
    return initialState
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const ejecutarConsulta = async () => {
    setLoading(true)
    const response = await consulta.fetchFn(formValues)
    if (response.success && response.data) {
      setResultado(response.data as any[])
      setSqlActual(response.sqlQuery || '')
    } else {
      alert(response.error || 'Error al ejecutar la consulta')
    }
    setLoading(false)
  }

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-normal text-gray-800 tracking-tight">{consulta.titulo}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{consulta.descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Justificación */}
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-md">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Justificación del SQL</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{consulta.justificacion}</p>
        </div>

        {/* Inputs dinámicos */}
        {consulta.inputs && consulta.inputs.length > 0 && (
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-md border border-gray-200">
            {consulta.inputs.map((input) => (
              <div key={input.name} className="flex flex-col space-y-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={formValues[input.name]}
                  onChange={handleInputChange}
                  className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Botón */}
        <Button
          onClick={ejecutarConsulta}
          disabled={loading}
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 hover:scale-[1.02] transition-all duration-200 shadow-sm"
        >
          {loading ? 'Ejecutando...' : 'Ejecutar Consulta'}
        </Button>

        {/* Resultados */}
        {resultado && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
            {/* Tabla */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Salida de Datos
              </div>
              <div className="overflow-x-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      {Object.keys(resultado[0] || {}).map((key) => (
                        <TableHead key={key} className="text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          {key.replace(/_/g, ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.length > 0 ? (
                      resultado.map((fila, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          {Object.values(fila).map((val: any, i) => (
                            <TableCell key={i} className="text-sm text-gray-700">
                              {val !== null ? String(val) : '—'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={100} className="text-center h-24 text-sm text-gray-400">
                          No hay registros para estos parámetros.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* SQL */}
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900">
              <div className="bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Script SQL Ejecutado
              </div>
              <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto h-full min-h-[150px]">
                <code>{sqlActual}</code>
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}