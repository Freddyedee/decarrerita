import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const body = await request.json();

        // Actualizamos SOLAMENTE la tabla chofer, dejando la tabla usuario intacta
        const choferActualizado = await prisma.chofer.update({
            where: { 
                id_usuario: Number(resolvedParams.id) 
            },
            data: { 
                disponible: body.disponible // true o false
            }
        });

        return NextResponse.json(choferActualizado);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al cambiar disponibilidad" },
            { status: 500 }
        );
    }
}