import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateClientRatingRequest } from "@modules/user/application/dto/UpdateClientRatingRequest";

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

        const dto: UpdateClientRatingRequest = {

            userId: Number(params.id),

            averageRating: body.averageRating

        };

        const response =
            await UserContainer.clientController.updateRating(dto);

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