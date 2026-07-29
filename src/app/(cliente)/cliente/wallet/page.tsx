// src/app/(cliente)/cliente/wallet/page.tsx (o la ruta donde lo tengas)

import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import RecargaForm from "@/components/cliente/RecargaForm";
import { WalletContainer } from "@/shared/container/WalletContainer";

export default async function WalletPage() {
  const sesion = await getCurrentRole();
  if (!sesion || sesion.rol !== "CLIENTE") redirect("/login");

  // 1. Consultar saldo real de la Wallet
  // Envolvemos en try-catch por si el usuario es nuevo y aún no se le ha generado la wallet
  let walletData = { saldoDisponible: 0, moneda: "USD" };
  try {
    const balance = await WalletContainer.getWalletBalanceUseCase.execute(sesion.usuarioId);
    walletData = {
      // Convertimos el decimal a número para pintarlo
      saldoDisponible: Number(balance.saldoDisponible), 
      moneda: balance.moneda
    };
  } catch (error) {
    console.warn("Wallet no encontrada para el usuario, mostrando saldo 0.");
  }

  // 2. Consultar bancos activos para el formulario
  const bancosActivos = await WalletContainer.getBancosActivosUseCase.execute();

  // Mapeamos los bancos al formato que espera nuestro componente visual
  const bancosFormateados = bancosActivos.map(b => ({
    id_banco: b.id,
    nombre: b.nombre
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Mi Wallet</h2>
        <p className="text-sm text-slate-500 mt-1">Consulta tus fondos y gestiona tus recargas de saldo.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Tarjeta de Saldo Disponible */}
        <div className="bg-white border border-[#E2E4E9] rounded-xl shadow-sm p-6 flex flex-col justify-between h-40">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Disponible</span>
            <h3 className="font-display text-4xl font-bold text-[#0E7C86] mt-2">
              {walletData.saldoDisponible.toFixed(2)} <span className="text-lg font-normal text-slate-500">{walletData.moneda}</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Fondos libres para solicitar traslados.</p>
        </div>

        {/* Formulario de Recargas */}
        <div className="md:col-span-2">
          <RecargaForm bancos={bancosFormateados} />
        </div>
      </div>
    </div>
  );
}