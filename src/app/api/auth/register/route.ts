import { NextResponse } from "next/server";
import { UserContainer } from "@/shared/container/UserContainer";
import { UserRole } from "@/modules/user/domain/enums/UserRole";
// <-- ELIMINADO: import bcrypt from "bcrypt"; ¡Ya no se necesita aquí!

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      role, 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      licenseNumber, 
      bankId 
    } = body;

    if (!role || !firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios para el registro base." },
        { status: 400 }
      );
    }

    let assignedRole: UserRole;

    if (role === "CLIENTE" || role === UserRole.CLIENT) {
      assignedRole = UserRole.CLIENT;
    } else if (role === "CHOFER" || role === UserRole.DRIVER) {
      assignedRole = UserRole.DRIVER;
      if (!licenseNumber) {
        return NextResponse.json(
          { success: false, message: "La licencia es obligatoria para registrar un chofer." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Rol inválido o no permitido en esta ruta pública." },
        { status: 403 }
      );
    }

    // <-- ELIMINADO: Todo el bloque de saltRounds y bcrypt.hash

    // Ejecución del Caso de Uso Único (Pasando el password limpio)
    const result = await UserContainer.createUserUseCase.execute({
      role: assignedRole,
      firstName,
      lastName,
      email,
      phone,
      password, // <-- Pasamos directamente la variable password en texto plano
      licenseNumber: assignedRole === UserRole.DRIVER ? licenseNumber : undefined,
      bankId: assignedRole === UserRole.DRIVER ? bankId : undefined,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Usuario creado exitosamente.",
        data: result
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("[AUTH REGISTER ERROR]:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Ocurrió un error interno al procesar el registro.";

    const isConflict = errorMessage.toLowerCase().includes("already exists");
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: isConflict ? 409 : 500 }
    );
  }
}