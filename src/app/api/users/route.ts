import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        const response =
            await UserContainer.userController.createUser(body);

        return NextResponse.json(response, {
            status: 201
        });

    } catch (error) {

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error"
            },
            {
                status: 400
            }
        );

    }

}