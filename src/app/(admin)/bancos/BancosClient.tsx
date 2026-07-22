"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Building,
  Power,
  PowerOff,
  Search,
  Loader2,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogPortal, 

} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Banco {
  id: number;
  codigo_banco: string;
  nombre: string;
  activo: boolean;
}

export function BancosClient() {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ codigo: "", nombre: "" });

  const fetchBancos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bancos");
      if (response.ok) {
        const data = await response.json();
        setBancos(data);
      }
    } catch (error) {
      console.error("Error cargando bancos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBancos();
  }, []);

  function handleDialogOpenChange(open: boolean) {
  setIsDialogOpen(open);
  if (open) {
    setDialogKey(prev => prev + 1); 
  } else {
    setFormData({ codigo: "", nombre: "" });
  }
}

  const handleCreateBanco = async () => {
    if (formData.codigo.length !== 4 || !formData.nombre.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/bancos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: formData.codigo,
          nombre: formData.nombre,
          activo: true,
        }),
      });

      if (response.ok) {
        handleDialogOpenChange(false);
        fetchBancos();
      }
    } catch (error) {
      console.error("Error creando banco:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEstado = async (id: number, estadoActual: boolean) => {
    try {
      const response = await fetch(`/api/bancos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, activo: !estadoActual }),
      });

      if (response.ok) {
        fetchBancos();
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const filteredBancos = bancos.filter(
    (banco) =>
      banco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (banco.codigo_banco && banco.codigo_banco.includes(searchTerm))
  );

  const isFormValid =
    formData.codigo.length === 4 && formData.nombre.trim().length > 2;

  return (
    <Card className="mt-6 border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {/* BARRA DE HERRAMIENTAS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {searchTerm && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                {filteredBancos.length} resultados
              </span>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Banco
                  </Button>
                </DialogTrigger>

                <DialogPortal>
                <DialogContent key = {dialogKey} className="fixed left-[50%] top-[50%] z-50 w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-bottom-5 sm:rounded-lg">              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-teal-50 rounded-full">
                    <Landmark className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      Registrar Entidad
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                      Ingresa los datos operativos del banco.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-5 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo" className="text-sm font-medium text-slate-700">
                    Código del Banco (4 dígitos)
                  </Label>
                  <div className="relative">
                    <Input
                      id="codigo"
                      type="text"
                      maxLength={4}
                      value={formData.codigo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          codigo: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="Ej. 0102"
                      className="font-mono pr-12 focus:ring-teal-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {formData.codigo.length}/4
                    </span>
                  </div>
                  {formData.codigo.length > 0 && formData.codigo.length < 4 && (
                    <p className="text-xs text-amber-600 mt-1">
                      El código debe tener exactamente 4 dígitos.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                    Nombre Comercial <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej. Banco de Venezuela"
                    className="focus:ring-teal-500"
                  />
                  {formData.nombre.trim().length > 0 &&
                    formData.nombre.trim().length < 3 && (
                      <p className="text-xs text-amber-600 mt-1">
                        El nombre debe tener al menos 3 caracteres.
                      </p>
                    )}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 pt-4 mt-2">
                <Button
                    variant="outline"
                    onClick={() => {
                      console.log("Cancelar clicado");
                      handleDialogOpenChange(false);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                <Button
                  onClick={handleCreateBanco}
                  disabled={!isFormValid || isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando
                    </>
                  ) : (
                    "Guardar Banco"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>

        {/* TABLA */}
        <div className="relative w-full overflow-auto min-h-[300px]">
          <Table className="border-separate border-spacing-y-2">
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] font-semibold text-slate-600 rounded-l-md">
                  ID
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-slate-600">
                  Código
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Nombre de Entidad
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Estado
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600 rounded-r-md">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-[250px] text-center bg-white rounded-lg"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                      <p className="text-sm font-medium">
                        Sincronizando directorio bancario...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBancos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-[250px] text-center bg-white rounded-lg"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Building className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">
                        {searchTerm
                          ? "No se encontraron bancos con esa búsqueda."
                          : "No hay bancos registrados en el sistema."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBancos.map((banco) => (
                  <TableRow
                    key={banco.id}
                    className="bg-white hover:bg-slate-50/80 transition-colors group rounded-lg shadow-sm border-b-0"
                  >
                    <TableCell className="font-mono text-slate-400 text-xs py-3 rounded-l-lg">
                      {banco.id != null
                        ? `#${banco.id.toString().padStart(4, "0")}`
                        : "-"}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="font-mono bg-slate-50 text-slate-600 border-slate-200"
                      >
                        {banco.codigo_banco || "0000"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 py-3">
                      {banco.nombre}
                    </TableCell>
                    <TableCell className="py-3">
                      {banco.activo ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                          Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-sm">
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3 rounded-r-lg">
                      <Button
                        variant={banco.activo ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleEstado(banco.id, banco.activo)}
                        className={
                          banco.activo
                            ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                        }
                      >
                        {banco.activo ? (
                          <>
                            <PowerOff className="w-3.5 h-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Suspender</span>
                          </>
                        ) : (
                          <>
                            <Power className="w-3.5 h-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Activar</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}