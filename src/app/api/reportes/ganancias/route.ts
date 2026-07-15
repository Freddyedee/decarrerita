// src/app/api/reportes/ganancias/route.ts

import { NextRequest, NextResponse } from "next/server";
import { reportesController } from "@/modules/wallet/presentation/wallet.modules";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const desdeParam = searchParams.get("desde");
    const hastaParam = searchParams.get("hasta");

    if (!desdeParam || !hastaParam) {
      return NextResponse.json(
        { message: "Error retrieving ganancias", error: "Both 'desde' and 'hasta' query params are required" },
        { status: 400 }
      );
    }

    const desde = new Date(desdeParam);
    const hasta = new Date(hastaParam);

    const data = await reportesController.getGanancias(desde, hasta);

    return NextResponse.json({ message: "Ganancias retrieved successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving ganancias", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}