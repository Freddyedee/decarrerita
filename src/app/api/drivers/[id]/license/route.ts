import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { UpdateDriverLicenseRequest } from "@modules/user/application/dto/UpdateDriverLicenseRequest";

export async function PATCH(
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

        const dto: UpdateDriverLicenseRequest = {

            userId: Number(params.id),

            licenseNumber: body.licenseNumber

        };

        const response =
            await UserContainer.driverController.updateLicense(dto);

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