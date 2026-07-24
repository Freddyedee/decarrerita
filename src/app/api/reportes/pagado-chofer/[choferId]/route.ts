// src/app/api/reportes/pagado-chofer/[choferId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { reportesController } from "@/modules/wallet/presentation/wallet.modules";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ choferId: string }> } // 1. Convertimos a Promesa
) {
  try {
    const { searchParams } = new URL(req.url);
    const desde = new Date(searchParams.get("desde")!);
    const hasta = new Date(searchParams.get("hasta")!);

    // 2. Extraemos el choferId esperando la promesa
    const { choferId } = await params;

    // 3. Pasamos choferId directamente
    const data = await reportesController.getPagadoAChofer(Number(choferId), desde, hasta);
    
    return NextResponse.json({ message: "Pagado a chofer retrieved successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving pagado a chofer", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}