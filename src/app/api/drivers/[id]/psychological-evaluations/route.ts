import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { RegisterPsychologicalEvaluationRequest } from "@modules/user/application/dto/RegisterPsychologicalEvaluationRequest";

export async function POST(
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

        const dto: RegisterPsychologicalEvaluationRequest = {

            driverUserId: Number(params.id),

            result: body.result,

            observations: body.observations,

            expirationDate: new Date(body.expirationDate),

            score: body.score

        };

        const response =
            await UserContainer.psychologicalEvaluationController.register(dto);

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

export async function GET(
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

        const response =
            await UserContainer.psychologicalEvaluationController.getByDriver(
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
            {
                status: 400
            }
        );

    }

}