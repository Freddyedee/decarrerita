"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CarFront, Wallet, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Definimos las rutas principales del chofer
  const navItems = [
    { name: "Radar", href: "/chofer", icon: Home },
    { name: "Vehículos", href: "/chofer/vehiculos", icon: CarFront },
    { name: "Wallet", href: "/chofer/wallet", icon: Wallet },
    { name: "Perfil", href: "/chofer/perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          // Verificamos si la ruta actual coincide para "encender" el botón
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? "fill-blue-50 stroke-blue-600" : ""}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}