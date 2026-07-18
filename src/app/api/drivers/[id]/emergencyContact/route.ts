import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { RegisterEmergencyContactRequest } from "@modules/user/application/dto/RegisterEmergencyContactRequest";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {

    try {

        const body = await request.json();

        const dto: RegisterEmergencyContactRequest = {

            driverUserId: Number(params.id),

            contactName: body.contactName,

            relationship: body.relationship,

            phone: body.phone

        };

        const response =
            await UserContainer.emergencyContactController.register(dto);

        return NextResponse.json(response, { status: 201 });

    } catch (error) {

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error"
            },
            { status: 400 }
        );

    }

}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {

    try {

        const response =
            await UserContainer.emergencyContactController.getByDriver(
                Number(params.id)
            );

        return NextResponse.json(response);

    } catch (error) {

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error"
            },
            { status: 400 }
        );

    }

}