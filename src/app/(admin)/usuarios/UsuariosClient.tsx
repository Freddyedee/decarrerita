"use client";

import { useEffect, useState } from "react";
import { 
  Search, Loader2, Users, UserCog, AlertTriangle, 
  Copy, Eye, Pencil, Ban, Plus, ShieldCheck, CheckCircle2, XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export interface UserResponse {
  user_id: number | null;
  role: number; // 1 = ADMIN, 2 = CLIENTE, 3 = CHOFER
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export function UsuariosClient() {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para el Modal de Crear Admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/users?t=${Date.now()}`, { cache: "no-store" });
      
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Error al obtener la lista de usuarios. Revisa los números de teléfono en la BD.");
      }

      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : data.data || []);
    } catch (error: any) {
      console.error("Error cargando usuarios:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Crear un Nuevo Administrador
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAdmin(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Nota: Ajusta los nombres de las propiedades si tu CreateUserDTO espera camelCase o español

      const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, "");
      const payload = {
        firstName: nombre.trim(),
        lastName: apellido.trim(),
        email: email.trim().toLowerCase(),
        phone: telefonoLimpio,
        passwordHash: password,
        role: 1,    // 1 representa el rol ADMIN
      };

      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.error || "No se pudo crear el administrador");
      }

      setSuccessMsg("¡Usuario Administrador creado con éxito!");
      setShowAdminModal(false);
      
      // Limpiar formulario
      setNombre("");
      setApellido("");
      setEmail("");
      setTelefono("");
      setPassword("");

      // Recargar tabla
      await cargarUsuarios();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setSubmittingAdmin(false);
    }
  };

  // Filtrado en tiempo real en la tabla
  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.firstName || "").toLowerCase().includes(term) ||
      (u.lastName || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.phone || "").includes(term)
    );
  });

  const obtenerBadgeRol = (rol: number) => {
    switch (rol) {
      case 1:
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-black">ADMIN</span>;
      case 2:
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">CLIENTE</span>;
      case 3:
        return <span className="bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-bold">CHOFER</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">Rol #{rol}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra superior: Buscador y Botón de Crear Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7C86]"
          />
        </div>

        <button
          onClick={() => setShowAdminModal(true)}
          className="w-full sm:w-auto bg-[#0E7C86] hover:bg-[#095259] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          Nuevo Administrador
        </button>
      </div>

      {/* Alertas de Éxito o Error */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Error del Sistema:</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-[#0E7C86] animate-spin mb-3" />
              <p className="text-slate-400 font-medium text-sm">Cargando directorio de usuarios...</p>
            </div>
          ) : usuariosFiltrados.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Usuario</TableHead>
                  <TableHead className="font-bold text-slate-700">Rol</TableHead>
                  <TableHead className="font-bold text-slate-700">Contacto</TableHead>
                  <TableHead className="font-bold text-slate-700">Estado</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {usuariosFiltrados.map((u, index) => (
                  <TableRow key={u.user_id || `user-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      <div>
                        <span className="font-bold">{u.firstName} {u.lastName}</span>
                        <span className="block text-xs text-slate-400 font-mono">ID: #{u.user_id || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {obtenerBadgeRol(u.role)}
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      <div className="text-slate-800 font-medium">{u.email}</div>
                      <div className="text-slate-500 font-mono">{u.phone || "Sin teléfono"}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.status === "ACTIVO" || u.status === "ACTIVE" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {u.status || "ACTIVO"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500 font-mono">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-VE") : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm space-y-2">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No se encontraron usuarios</p>
              <p>Intenta con otros términos de búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE CREAR ADMINISTRADOR */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0E7C86]" /> Crear Nuevo Admin
              </h3>
              <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Carlos"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej: Rodríguez"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@decarrerita.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono</label>
                <input
                  type="text"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="04141234567"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Ingresa entre 8 y 15 dígitos numéricos.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0E7C86] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingAdmin}
                  className="flex-1 bg-[#0E7C86] hover:bg-[#095259] disabled:bg-slate-300 text-white font-bold text-sm py-2.5 rounded-xl shadow-sm flex justify-center items-center gap-2 transition-all"
                >
                  {submittingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}