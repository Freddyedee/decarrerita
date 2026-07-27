import { ReactNode } from "react";
import BottomNav from "@/components/chofer/BottomNav";

export default function ChoferLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      
      {/* pt-20 (o pt-24 en pantallas medianas) EMPUJA todo el contenido hacia abajo.
        Con esto, ninguna de las ventanas del chofer volverá a quedar cortada por la barra superior.
      */}
      <main className="flex-1 pt-20 md:pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}