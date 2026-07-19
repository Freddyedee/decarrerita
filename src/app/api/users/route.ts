import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
import { userController } from "@modules/user/presentation/router/UserRouter";
=======
import { UserContainer } from "@/shared/container/UserContainer";
>>>>>>> origin/modulo-cliente

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        const response =
<<<<<<< HEAD
            await userController.createUser(body);
=======
            await UserContainer.userController.createUser(body);
>>>>>>> origin/modulo-cliente

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