// src/app/api/reportes/pagado-chofer/[choferId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { reportesController } from "@/modules/wallet/presentation/wallet.modules";

export async function GET(req: NextRequest, { params }: { params: { choferId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const desde = new Date(searchParams.get("desde")!);
    const hasta = new Date(searchParams.get("hasta")!);

    const data = await reportesController.getPagadoAChofer(Number(params.choferId), desde, hasta);
    return NextResponse.json({ message: "Pagado a chofer retrieved successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving pagado a chofer", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}