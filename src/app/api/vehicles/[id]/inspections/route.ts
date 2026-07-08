import { NextRequest, NextResponse } from "next/server";
import { revisionController } from "@/modules/vehicles/presentation/vehicle.modules";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const history = await revisionController.getHistory(Number(params.id));
    return NextResponse.json(
      { message: "Inspection history retrieved successfully", data: history },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving inspection history", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await req.json(); // { score: number, observations: string }

    const revision = await revisionController.register({
      vehicleId: Number(params.id),
      score: Number(raw.score),
      observations: raw.observations
    });

    return NextResponse.json(
      { message: "Inspection registered successfully", data: revision },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error registering inspection", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}