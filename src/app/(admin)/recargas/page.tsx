import { prisma } from "@/shared/lib/prisma";
import { RecargasClient, RecargaAdminDTO } from "./RecargasClient";

export default async function RecargasAdminPage() {
  const rawRecargas = await prisma.recarga.findMany({
    include: {
      banco: true,
      wallet: {
        include: {
          usuario: true,
        },
      },
    },
    orderBy: {
      fecha_solicitud: "desc",
    },
  });

  const recargasFormatted: RecargaAdminDTO[] = rawRecargas.map((r) => ({
    id: r.id_recarga,
    clienteNombre: `${r.wallet.usuario.nombre} ${r.wallet.usuario.apellido}`,
    clienteEmail: r.wallet.usuario.email,
    bancoNombre: r.banco.nombre_banco,
    monto: Number(r.monto),
    referenciaPago: r.referencia_pago,
    estado: r.estado,
    fechaSolicitud: new Intl.DateTimeFormat("es-VE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(r.fecha_solicitud)),
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Validación de Recargas</h2>
        <p className="text-slate-500 mt-1">
          Aprueba o rechaza los reportes de pago de los clientes para acreditar saldo en sus wallets.
        </p>
      </div>

      <RecargasClient initialRecargas={recargasFormatted} />
    </div>
  );
}