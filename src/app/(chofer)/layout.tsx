// src/app/(chofer)/layout.tsx

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";

export default async function ChoferLayout({ children }: { children: React.ReactNode }) {

    const sesion = await getCurrentRole();

    if (!sesion || sessionStorage.rol !== "CHOFER") {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-[#F4F5F7] text-[#12131A]">
            <aside className="w-60 shrink-0 bg-white border-r border-[#E2E4E9] flex flex-col">
                <div className="px-6 py-8 border-b border-[#E2E4E9]">
                    <p className="text-lg font-bold tracking-tight">Decarrerita</p>
                    <p className="text-xs text-[#12131A]/40 mt-1 font-mono">panel chofer</p>
                </div>
                <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
                    <a href="/traslados" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Ofertas y viajes</a>
                    <a href="/vehiculos" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Mis vehículos</a>
                    <a href="/wallet" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Mi billetera</a>
                </nav>
            </aside>
            <main className="flex-1 px-10 py-8">{children}</main>
        </div>
    );
}