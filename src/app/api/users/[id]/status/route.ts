import { NextRequest, NextResponse } from "next/server";
import { UserContainer } from "@/shared/container/UserContainer";
import { UpdateUserStatusRequest } from "@modules/user/application/dto/UpdateUserStatusRequest";

export async function PATCH(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>; // 1. Indicamos que params es una Promesa
    }
) {
    try {
        // 2. Desempaquetamos la promesa usando await
        const resolvedParams = await params; 
        const body = await request.json();

        const dto: UpdateUserStatusRequest = {
            userId: Number(resolvedParams.id), // 3. Usamos el ID ya resuelto
            status: body.status
        };

        const response = await UserContainer.userController.updateStatus(dto);

        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error"
            },
            {
                status: 400
            }
        );
    }
}