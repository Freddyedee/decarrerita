"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Car,
  BadgeCheck,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<2 | 3>(2);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validaciones
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone);
  const validateNationalId = (id: string) => /^[VvEe]\-\d{7,8}$/.test(id);
  const isFormValid = () => {
    const { firstName, lastName, nationalId, email, phone, password, licenseNumber } = formData;
    if (!firstName || !lastName || !nationalId || !email || !phone || !password) return false;
    if (!validateEmail(email)) return false;
    if (!validatePhone(phone)) return false;
    if (!validateNationalId(nationalId)) return false;
    if (role === 3 && !licenseNumber) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload: any = {
      role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      NationalId: formData.nationalId,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    if (role === 3) payload.licenseNumber = formData.licenseNumber;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrarse");

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-900">
      
      {/* Fondo minimalista (Atmósfera sutil) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-chambray-100/40 rounded-full mix-blend-multiply filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Crear cuenta
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Únete a <span className="font-semibold text-slate-700">Decarrerita</span> y comienza a viajar.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Selector de rol estilizado */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setRole(2)}
              className={`relative p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                role === 2
                  ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <Users className={`w-5 h-5 ${role === 2 ? "text-slate-900" : "text-slate-400"}`} />
                {role === 2 && <CheckCircle2 className="w-5 h-5 text-slate-900" />}
              </div>
              <div>
                <span className={`block text-sm font-semibold ${role === 2 ? "text-slate-900" : "text-slate-600"}`}>
                  Cliente
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Quiero viajar</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setRole(3)}
              className={`relative p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                role === 3
                  ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <Car className={`w-5 h-5 ${role === 3 ? "text-emerald-600" : "text-slate-400"}`} />
                {role === 3 && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <div>
                <span className={`block text-sm font-semibold ${role === 3 ? "text-emerald-700" : "text-slate-600"}`}>
                  Chofer
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Quiero conducir</span>
              </div>
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Juan"
                    className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                      touched.firstName && !formData.firstName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                    } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Apellido</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Pérez"
                  className={`block w-full px-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                    touched.lastName && !formData.lastName
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Cédula de Identidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BadgeCheck className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="nationalId"
                  type="text"
                  value={formData.nationalId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="V-12345678"
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                    touched.nationalId && !validateNationalId(formData.nationalId)
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                />
              </div>
              {touched.nationalId && !validateNationalId(formData.nationalId) && (
                <p className="text-xs text-red-500 mt-1.5">El formato debe ser V-12345678</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="juan@ejemplo.com"
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                    touched.email && !validateEmail(formData.email)
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="+584141234567"
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                    touched.phone && !validatePhone(formData.phone)
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                />
              </div>
            </div>

            {role === 3 && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Número de Licencia</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={role === 3}
                    placeholder="V-12345678"
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-white placeholder-slate-400 transition-shadow ${
                    touched.password && formData.password.length < 6
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                />
              </div>
              {touched.password && formData.password.length > 0 && formData.password.length < 6 && (
                <p className="text-xs text-red-500 mt-1.5">Mínimo 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white transition-all duration-200 mt-2 ${
                isLoading || !isFormValid()
                  ? "bg-slate-300 cursor-not-allowed"
                  : role === 3
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md hover:shadow-emerald-600/20"
                  : "bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md hover:shadow-slate-900/20"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="font-semibold text-slate-900 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}