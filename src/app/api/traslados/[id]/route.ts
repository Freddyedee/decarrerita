import { NextRequest, NextResponse } from "next/server";
import { trasladoController } from "@/modules/Traslado/presentation/traslado.modules";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const traslado = await trasladoController.getById(Number(params.id));
    return NextResponse.json({ message: "Traslado retrieved successfully", data: traslado }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving traslado", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 }
    );
  }
}