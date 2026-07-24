import { NextRequest, NextResponse } from "next/server";

import { UserContainer } from "@/shared/container/UserContainer";

import { RegisterEmergencyContactRequest } from "@modules/user/application/dto/RegisterEmergencyContactRequest";
import { ContextMenu } from "@base-ui/react";
import { GetDriverByIdUseCase } from "@/modules/user/application/use-cases/GetDriverByIdUseCase";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    
    const params = await context.params;

    const body = await request.json();

    const dto = {
      driverUserId: Number(params.id),
      contactName: body.contactName,
      relationship: body.relationship,
      phone: body.phone
    };

    const response = await UserContainer.emergencyContactController.register(dto);
    
    return NextResponse.json({ success: true, data: response }, { status: 201 });

  } catch (error: any) {
    
    // Forzamos un status 500 y un JSON de error claro
    return NextResponse.json(
      { success: false, message: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(
    request: Request,
    context : { params: Promise < { id: string } > }
) {

    try {

        const params = await context.params; 
        const driverId = Number(params.id); 

        const response = await UserContainer.emergencyContactController.getByDriver(driverId); 
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