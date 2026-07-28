// src/app/(cliente)/cliente/wallet/page.tsx
import { getCurrentRole } from "@/shared/auth/userCurrentRole";
import { redirect } from "next/navigation";
import { WalletContainer } from "@/shared/container/WalletContainer";
import WalletDashboard from "./WalletDashboard"; // Importamos el nuevo componente

export default async function WalletPage() {
  const sesion = await getCurrentRole();
  if (!sesion || sesion.rol !== "CLIENTE") redirect("/login");

  // 1. Obtener saldo
  let walletData = { saldoDisponible: 0, moneda: "USD" };
  try {
    const balance = await WalletContainer.getWalletBalanceUseCase.execute(sesion.usuarioId);
    walletData = {
      saldoDisponible: Number(balance.saldoDisponible),
      moneda: balance.moneda
    };
  } catch (error) {
    console.warn("Wallet no encontrada para el usuario, mostrando saldo 0.");
  }

  // 2. Obtener bancos
  const bancosActivos = await WalletContainer.getBancosActivosUseCase.execute();
  const bancosFormateados = bancosActivos.map(b => ({
    id_banco: b.id,
    nombre: b.nombre
  }));

  // 3. Datos simulados de movimientos
  const transaccionesRecientes = [
    { id: 1, tipo: "recarga", monto: 25.00, fecha: "2025-07-28", estado: "completado", banco: "Banco Nacional" },
    { id: 2, tipo: "pago", monto: 12.50, fecha: "2025-07-27", estado: "completado", descripcion: "Traslado #123" },
    { id: 3, tipo: "recarga", monto: 50.00, fecha: "2025-07-26", estado: "pendiente", banco: "Banco Internacional" },
  ];

  // 4. Pasamos los datos listos al componente de cliente
  return (
    <WalletDashboard 
      walletData={walletData} 
      bancos={bancosFormateados} 
      transacciones={transaccionesRecientes} 
    />
  );
}