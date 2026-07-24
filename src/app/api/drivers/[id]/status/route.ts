import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateDriverStatusRequest } from "@modules/user/application/dto/UpdateDriverStatusRequest";

export async function PATCH(
    request: NextRequest, { params }: { params: Promise<{ id : string}> }

) {

    try {

        const {id} = await params; 

        const body = await request.json();

        const dto: UpdateDriverStatusRequest = {

            userId: Number(id),

            status: body.status

        };

        const response =
            await UserContainer.driverController.updateStatus(dto);

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