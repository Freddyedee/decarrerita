import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateUserProfileRequest } from "@modules/user/application/dto/UpdateUserProfileRequest";

export async function PATCH(
   request: NextRequest, { params }: { params: Promise<{ id : string}> }
) {
    try {

        const {id} = await params; 

        const body = await request.json();

        const dto: UpdateUserProfileRequest = {

            userId: Number(id),

            firstName: body.firstName,

            lastName: body.lastName,

            email: body.email,

            phone: body.phone,

            password: body.passwordHash

        };

        const response =
            await UserContainer.userController.updateProfile(dto);

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