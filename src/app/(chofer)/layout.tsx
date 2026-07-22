import { ReactNode } from "react";
import BottomNav from "@/components/chofer/BottomNav";

export default function ChoferLayout({ children }: { children: ReactNode }) {
  return (
    // min-h-screen asegura que ocupe toda la pantalla
    // bg-gray-50 da un color de fondo neutro típico de apps móviles
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      
      {/* Contenedor principal. El pb-20 (padding-bottom) es crucial 
          para que la lista de traslados no se esconda detrás del menú inferior */}
      <main className="flex-1 pb-20">
        {/* Aquí Next.js inyectará page.tsx (el Radar, Wallet, etc.) */}
        {children}
      </main>

      {/* Inyectamos nuestra barra de navegación */}
      <BottomNav />
    </div>
  );
}