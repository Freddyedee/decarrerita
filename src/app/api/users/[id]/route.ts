import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
import { userController } from "@modules/user/presentation/router/UserRouter";
=======
import { UserContainer } from "@/shared/container/UserContainer";
>>>>>>> origin/modulo-cliente

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
<<<<<<< HEAD
            await userController.getUserById(id);
=======
            await UserContainer.userController.getUserById(id);
>>>>>>> origin/modulo-cliente

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