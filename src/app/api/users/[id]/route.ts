import { NextRequest, NextResponse } from "next/server";
import { UserContainer } from "@/shared/container/UserContainer";
import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(
    request: NextRequest, { params }: { params: Promise<{ idParams : string}> }
) {

    try {

      const { idParams } =await params; 

        const id = Number(idParams);

        const response =
            await UserContainer.userController.getUserById(id);

        return NextResponse.json(response);

    } catch (error) {

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error"
            },
            {
                status: 404
            }
        );

    }

}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Extraemos el ID de la URL y esperamos la promesa de params
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);

    // 2. Extraemos los datos que nos envió el frontend en el body
    const body = await request.json();

    // 3. Actualizamos el registro en la base de datos
    const usuarioActualizado = await prisma.usuario.update({
      where: { 
        id_usuario: userId // Asegúrate de que este nombre coincida con tu esquema
      },
      data: {
        nombre: body.firstName,
        apellido: body.lastName,
        email: body.email,
        telefono: body.phone || null,
      },
    });

    // 4. Devolvemos un éxito al frontend
    return NextResponse.json(usuarioActualizado, { status: 200 });

  } catch (error) {
    console.error("Error en PUT /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el usuario en la base de datos" }, 
      { status: 500 }
    );
  }
}