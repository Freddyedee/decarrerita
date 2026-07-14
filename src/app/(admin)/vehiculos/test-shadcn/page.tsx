"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const vehiculosDemo = [
  { placa: "AB123CD", modelo: "Toyota Hilux", estado: "vigente", color: "bg-teal-500/10 text-teal-700 border-teal-500/20" },
  { placa: "XY987ZW", modelo: "Ford Ranger", estado: "vencida", color: "bg-red-500/10 text-red-700 border-red-500/20" },
  { placa: "JK555LM", modelo: "Chevrolet Silverado", estado: "por_vencer", color: "bg-amber-500/15 text-amber-800 border-amber-500/20" },
];

export default function TestVehiculosPage() {
  return (
    // 1. FONDO GENERAL: Cambiamos a un gris muy sutil (bg-slate-50/70) y le damos padding para crear separación
    <div className="min-h-screen bg-slate-50/70 p-6 md:p-8 font-sans antialiased">
      
      {/* CONTENEDOR PRINCIPAL: Maximizamos el orden visual */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ENCABEZADO ESTILO DASHBOARD */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Visualización de Flota
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Validando la nueva estética en componentes de gestión de flota.
            </p>
          </div>
          <Button variant="default" className="bg-black hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all shadow-sm">
            Actualizar Vista
          </Button>
        </header>

        {/* DISTRIBUCIÓN EN REJILLA (Como los bloques del configurador) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TARJETA DE TABLA (Ocupa 2 columnas) */}
          <Card className="md:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-900">Monitoreo de Unidades</CardTitle>
              <CardDescription className="text-xs">Estado técnico actual de los vehículos activos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0"> {/* Eliminamos padding lateral para que la tabla llegue al borde */}
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Placa</TableHead>
                    <TableHead className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Modelo</TableHead>
                    <TableHead className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {vehiculosDemo.map((v) => (
                    <TableRow key={v.placa} className="transition-colors hover:bg-slate-50/40 border-b border-slate-100 last:border-0">
                      <TableCell className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">{v.placa}</TableCell>
                      <TableCell className="px-6 py-4 text-slate-600 text-sm">{v.modelo}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Badge variant="outline" className={`font-mono text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${v.color}`}>
                          {v.estado.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* TARJETA DE RESUMEN / MÉTRICAS (Ocupa 1 columna, simulando los widgets de la derecha de la referencia) */}
          <Card className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <CardHeader className="px-6 py-5">
              <CardTitle className="text-base font-semibold text-slate-900">Resumen de Alertas</CardTitle>
              <CardDescription className="text-xs">Urgencias detectadas en el sistema.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2 space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-800 uppercase tracking-wider">Críticos</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">1</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-medium text-amber-800 uppercase tracking-wider">Por Vencer</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">1</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 px-6 py-4 bg-slate-50/30">
              <Button variant="outline" className="w-full bg-white text-slate-700 border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium py-2">
                Ver Reporte Completo
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}