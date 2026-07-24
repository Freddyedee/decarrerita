import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

export async function GET(
    request: NextRequest, { params }: { params: Promise<{ id : string}> }
) {

    const { id } = await params; 

    try {

        const response =
            await UserContainer.clientController.getById(Number(id));

        return NextResponse.json(
            { message: "Client retrieved successfully", data: response },
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