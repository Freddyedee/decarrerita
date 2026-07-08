import { NextRequest, NextResponse } from "next/server";

import { userController } from "@modules/user/presentation/router/UserRouter";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {

    try {

        const id = Number(params.id);

        const response =
            await userController.getUserById(id);

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