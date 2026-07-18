import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {

    try {

        const response =
            await UserContainer.driverController.getById(Number(params.id));

        return NextResponse.json(
            { message: "Driver retrieved successfully", data: response },
            { status: 200 }
        );

    } catch (error) {

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error"
            },
            { status: 404 }
        );

    }

}