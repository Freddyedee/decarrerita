"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Users, UserCog, AlertTriangle, Copy, Eye, Pencil, Ban} from "lucide-react";
import { Button , buttonVariants} from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";


// Definimos la interfaz basada exactamente en tu DTO
export interface UserResponse {
  user_id: number | null;
  role: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string; // Al venir por JSON desde el backend, la fecha llega como string
}


export function UsuariosClient() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UserResponse | null >(null);
  
  const [usuarioAEditar, setUsuarioAEditar] = useState<UserResponse | null>(null);
  const [usuarioASuspender, setUsuarioASuspender] = useState<UserResponse | null>(null);

  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      // Asumimos que tu endpoint principal para listar usuarios es este:
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        // Si tu API devuelve { data: [...] }, cambia esto a data.data
        setUsuarios(data); 
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrado múltiple: Busca por nombre, apellido, correo o teléfono
  const filteredUsuarios = usuarios.filter((user) => {
    const searchStr = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchStr) ||
      user.email.toLowerCase().includes(searchStr) ||
      user.phone.includes(searchStr)
    );
  });

  // Helper para pintar el Rol (Ajusta los números según tu base de datos)
  const getRoleBadge = (roleId: number) => {
    switch (roleId) {
      case 1: // Asumiendo que 1 es Admin
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 shadow-none">Admin</Badge>;
      case 2: // Asumiendo que 2 es Chofer
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-none">Chofer</Badge>;
      case 3: // Asumiendo que 3 es Cliente
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-none">Cliente</Badge>;
      default:
        return <Badge variant="outline">Rol {roleId}</Badge>;
    }
  };

  // Helper para pintar el Estado (Ajusta los strings según tu base de datos)
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("activo") || s.includes("aprobado")) {
      return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">Activo</Badge>;
    }
    if (s.includes("pendiente")) {
      return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200">Pendiente</Badge>;
    }
    if (s.includes("suspendido") || s.includes("bloqueado")) {
      return <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200">Suspendido</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <Card className="mt-6 border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {/* BARRA DE BÚSQUEDA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="relative w-full overflow-auto min-h-[300px]">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[80px] font-semibold text-slate-600">ID</TableHead>
                <TableHead className="font-semibold text-slate-600">Usuario</TableHead>
                <TableHead className="font-semibold text-slate-600">Contacto</TableHead>
                <TableHead className="font-semibold text-slate-600">Rol</TableHead>
                <TableHead className="font-semibold text-slate-600">Estado</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[250px] text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                      <p className="text-sm font-medium">Cargando directorio de usuarios...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[250px] text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Users className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">
                        {searchTerm ? "No se encontraron usuarios con esa búsqueda." : "No hay usuarios registrados en el sistema."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios.map((user) => (
                  <TableRow key={user.user_id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell className="font-mono text-slate-400 text-xs py-3">
                      {user.user_id != null ? `#${user.user_id.toString().padStart(4, "0")}` : "-"}
                    </TableCell>
                    
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-sm text-slate-600">
                      {user.phone || "Sin teléfono"}
                    </TableCell>

                    <TableCell className="py-3">
                      {getRoleBadge(user.role)}
                    </TableCell>

                    <TableCell className="py-3">
                      {getStatusBadge(user.status)}
                    </TableCell>

                    <TableCell className="text-right py-3">

                     <DropdownMenu>
                         <DropdownMenuTrigger 

                                    className={buttonVariants({ 
                                      variant: "outline", 
                                      size: "sm", 
                                      className: "text-slate-600 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-200 cursor-pointer" 
                                    })}
                                  >
                                    <UserCog className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Gestionar</span>
                                  
                              
                            </DropdownMenuTrigger>
                          
                          <DropdownMenuContent align="end" className="w-48">
                            
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              
                              <DropdownMenuItem 
                                onClick={() => navigator.clipboard.writeText(String(user.user_id || ""))} 
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4 text-slate-500" />
                                <span>Copiar ID</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              {/* Usamos onClick para guardar al usuario de esta fila en la memoria */}
                              <DropdownMenuItem 
                                onClick={() => setUsuarioSeleccionado(user)} 
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                <span>Ver perfil</span>
                              </DropdownMenuItem>
                                                            
                              <DropdownMenuItem 
                                onClick={() => setUsuarioAEditar(user)}
                                className="cursor-pointer">

                                <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                                <span>Editar datos</span>
                              
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => setUsuarioASuspender(user)}
                              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspender</span>
                            </DropdownMenuItem>
                            
                          </DropdownMenuContent>
                        </DropdownMenu>
                      
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>

        <Sheet 
        open={!!usuarioSeleccionado} 
        onOpenChange={(open) => {
          if (!open) setUsuarioSeleccionado(null);
        }}
      >
        {/* Agregamos z-[99999] para que esté por encima de cualquier otra cosa en tu dashboard y bg-white para forzar el color de fondo */}
        <SheetContent className="w-[400px] sm:w-[540px] z-[99999] bg-white">
          <SheetHeader>
            <SheetTitle>Detalles del Usuario</SheetTitle>
            <SheetDescription>
              Información completa registrada en la base de datos.
            </SheetDescription>
          </SheetHeader>
          
          {usuarioSeleccionado && (
        <>
          {/* Fondo oscuro (Overlay) */}
          <div 
            className="fixed inset-0 z-[99998] bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setUsuarioSeleccionado(null)}
          />
          
          {/* El Panel Blanco */}
          <div className="fixed inset-y-0 right-0 z-[99999] w-full sm:w-[450px] bg-white shadow-2xl p-6 sm:p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-slate-200">
            
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Detalles del Usuario</h2>
                <p className="text-sm text-slate-500 mt-1">Información completa de la base de datos.</p>
              </div>
              <button 
                onClick={() => setUsuarioSeleccionado(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors"
                title="Cerrar panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="space-y-5 text-slate-700 mt-8">
              <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                <span className="text-sm font-semibold text-slate-500 flex items-center">ID:</span>
                <span className="col-span-2 font-medium text-slate-900">{String(usuarioSeleccionado.user_id)}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                <span className="text-sm font-semibold text-slate-500 flex items-center">Nombre:</span>
                <span className="col-span-2 font-medium text-slate-900">
                  {usuarioSeleccionado.firstName} {usuarioSeleccionado.lastName}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                <span className="text-sm font-semibold text-slate-500 flex items-center">Email:</span>
                <span className="col-span-2 font-medium text-slate-900 break-words">{usuarioSeleccionado.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                <span className="text-sm font-semibold text-slate-500 flex items-center">Teléfono:</span>
                <span className="col-span-2 font-medium text-slate-900">{usuarioSeleccionado.phone || "No registrado"}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pb-4">
                <span className="text-sm font-semibold text-slate-500 flex items-center">Estado:</span>
                <span className="col-span-2 font-medium capitalize">{usuarioSeleccionado.status}</span>
              </div>
            </div>
          </div>
        </>
      )}
          </SheetContent>
        </Sheet>

      {/* ---------------------------------------------------- */}
      {/* MODAL NATIVO (Suspender Usuario)                       */}
      {/* ---------------------------------------------------- */}
      {usuarioASuspender && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            
            <div className="bg-red-50 p-6 flex items-center border-b border-red-100">
              <div className="bg-red-100 p-2 rounded-full mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-900">¿Suspender usuario?</h3>
            </div>
            
            <div className="p-6 text-slate-600">
              <p>
                Estás a punto de suspender la cuenta de <span className="font-semibold text-slate-900">{usuarioASuspender.firstName} {usuarioASuspender.lastName}</span>.
              </p>
              <p className="mt-2 text-sm">
                Esta acción revocará su acceso al sistema inmediatamente. Podrás reactivarlo más adelante si lo deseas.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setUsuarioASuspender(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert(`Lógica para suspender ID: ${usuarioASuspender.user_id}`);
                  setUsuarioASuspender(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Sí, suspender
              </button>
            </div>
          </div>
        </div>

      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL NATIVO (Editar Usuario)                        */}
      {/* ---------------------------------------------------- */}
      {usuarioAEditar && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Cabecera */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Pencil className="w-5 h-5 mr-2 text-teal-600" />
                Editar Datos del Usuario
              </h3>
              <button 
                onClick={() => setUsuarioAEditar(null)}
                className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-2 transition-colors border border-transparent hover:border-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Formulario */}
            <form 

              onSubmit={async (e) => {
                  e.preventDefault();
                  
                  // 1. Capturamos los datos del formulario
                  const formData = new FormData(e.currentTarget);
                  const datosActualizados = Object.fromEntries(formData.entries());
                  
                  try {
                    // 2. Enviamos la actualización a tu API
                    // OJO: Cambia '/api/users' por la ruta real de tu backend si es diferente
                    const response = await fetch(`/api/users/${usuarioAEditar.user_id}`, {
                      method: 'PUT', // o 'PATCH', dependiendo de cómo hiciste tu backend
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(datosActualizados),
                    });

                    if (!response.ok) {
                      throw new Error('Error al guardar en la base de datos');
                    }

                    // 3. Si todo salió bien:
                    setUsuarioAEditar(null); // Cerramos el modal
                    
                    // 4. Forzamos a Next.js a actualizar la tabla en el fondo 
                    // sin recargar toda la página
                    router.refresh(); 
                    
                    // Opcional: Podrías poner aquí una notificación (Toast) de éxito
                    alert("¡Usuario actualizado correctamente!"); 

                  } catch (error) {
                    console.error("Error actualizando usuario:", error);
                    alert("Hubo un problema al guardar los cambios.");
                  }
                }}



                
              className="overflow-y-auto p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campo Nombre */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Nombre</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    defaultValue={usuarioAEditar.firstName} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    required
                  />
                </div>
                
                {/* Campo Apellido */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Apellido</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    defaultValue={usuarioAEditar.lastName} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Campo Email (usualmente es de solo lectura, pero lo dejamos editable por si acaso) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={usuarioAEditar.email} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-slate-50"
                />
              </div>

              {/* Campo Teléfono */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                <input 
                  type="tel" 
                  name="phone" 
                  defaultValue={usuarioAEditar.phone || ""} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                />
              </div>

              {/* Botones de acción del formulario */}
              <div className="pt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setUsuarioAEditar(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm flex items-center"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      
      )}

    </CardContent>
  </Card>
    
  );
}