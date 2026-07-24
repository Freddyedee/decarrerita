import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateDriverMetricsRequest } from "@modules/user/application/dto/UpdateDriverMetricsRequest";

export async function PATCH(
    request: NextRequest, { params }: { params: Promise<{ id : string}> }

) {

    const { id } = await params; 

    try {

        const body = await request.json();

        const dto: UpdateDriverMetricsRequest = {

            userId: Number(id),

            averageRating: body.averageRating,

            completedTrips: body.completedTrips

        };

        const response =
            await UserContainer.driverController.updateMetrics(dto);

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