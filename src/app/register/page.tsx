"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Car, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para alternar entre roles (Asumiendo: 2 = Cliente, 3 = Chofer)
  const [role, setRole] = useState<2 | 3>(2);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Construimos el DTO (Data Transfer Object) tal como lo espera tu CreateUserRequest
    const payload: any = {
      role: role,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"), // En un flujo real, esto se hashea en el backend
    };

    // Si es chofer, agregamos la licencia (obligatoria por tu RN-027)
    if (role === 3) {
      payload.licenseNumber = formData.get("licenseNumber");
      // Opcional: payload.bankId = Number(formData.get("bankId")) si tuvieras un select de bancos
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // ¡Registro exitoso! Redirigimos al login
      alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
      router.push("/login");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Selector de Rol */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole(2)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === 2 ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Soy Cliente
            </button>
            <button
              type="button"
              onClick={() => setRole(3)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === 3 ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Soy Chofer
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input name="firstName" type="text" required className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 border p-2.5" placeholder="Juan" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input name="lastName" type="text" required className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 border p-2.5" placeholder="Pérez" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input name="email" type="email" required className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 border p-2.5" placeholder="juan@ejemplo.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input name="phone" type="tel" required className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 border p-2.5" placeholder="+584141234567" />
              </div>
            </div>

            {/* CAMPOS DINÁMICOS PARA EL CHOFER */}
            {role === 3 && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="text-green-600 w-5 h-5" />
                  <h3 className="font-bold text-green-800 text-sm">Datos del Conductor</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Número de Licencia</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BadgeCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <input name="licenseNumber" type="text" required={role === 3} className="pl-10 block w-full rounded-xl border-green-200 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white border p-2.5" placeholder="V-12345678" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input name="password" type="password" required className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 border p-2.5" placeholder="••••••••" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : role === 3 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}