import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateUserStatusRequest } from "@modules/user/application/dto/UpdateUserStatusRequest";

export async function PATCH(
    request: NextRequest,
    {
        params,
    }: {
        params: {
            id: string;
        };
    }
) {

    try {

        const body = await request.json();

        const dto: UpdateUserStatusRequest = {

            userId: Number(params.id),

            status: body.status

        };

        const response =
            await UserContainer.userController.updateStatus(dto);

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