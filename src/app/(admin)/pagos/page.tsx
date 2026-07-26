import { prisma } from "@/shared/lib/prisma";
import { PagosClient, RetiroAdminDTO } from "./PagosClient";

export const dynamic = 'force-dynamic';

export default async function PagosAdminPage() {
  const rawRetiros = await prisma.solicitud_retiro.findMany({
    include: {
      wallet: {
        include: {
          usuario: true,
        },
      },
      banco: true,
    },
    orderBy: {
      fecha_solicitud: "desc",
    },
  });

  const retiros: RetiroAdminDTO[] = rawRetiros.map((r) => ({
    id: r.id_retiro,
    chofertNombre: `${r.wallet.usuario.nombre} ${r.wallet.usuario.apellido}`,
    choferEmail: r.wallet.usuario.email,
    bancoNombre: r.banco.nombre_banco,
    monto: Number(r.monto),
    numeroCuenta: r.numero_cuenta,
    titularCuenta: r.titular_cuenta,
    estado: r.estado,
    fechaSolicitud: new Intl.DateTimeFormat("es-VE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(r.fecha_solicitud)),
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pagos a Choferes</h2>
        <p className="text-slate-500 mt-1">
          Aprueba las solicitudes de retiro de dinero de los choferes para procesar los pagos a sus cuentas bancarias.
        </p>
      </div>

      <PagosClient initialRetiros={retiros} />
    </div>
  );
}
