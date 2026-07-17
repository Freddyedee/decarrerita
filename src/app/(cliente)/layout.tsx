// src/app/(cliente)/layout.tsx

import { useCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {

    const { rol } = useCurrentRole();

    if (rol !== "CLIENTE") {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-[#F4F5F7] text-[#12131A]">
            <aside className="w-60 shrink-0 bg-white border-r border-[#E2E4E9] flex flex-col">
                <div className="px-6 py-8 border-b border-[#E2E4E9]">
                    <p className="text-lg font-bold tracking-tight">Decarrerita</p>
                    <p className="text-xs text-[#12131A]/40 mt-1 font-mono">panel cliente</p>
                </div>
                <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
                    <a href="/dashboard" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Inicio</a>
                    <a href="/solicitar" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Solicitar viaje</a>
                    <a href="/traslados" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Mis viajes</a>
                    <a href="/recargas" className="px-3 py-2 rounded-lg text-[#12131A]/70 hover:bg-[#F4F5F7] transition-colors">Recargar saldo</a>
                </nav>
            </aside>
            <main className="flex-1 px-10 py-8">{children}</main>
        </div>
    );
}