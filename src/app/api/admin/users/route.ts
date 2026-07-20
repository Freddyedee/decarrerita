// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { UserContainer } from "@/shared/container/UserContainer";
import { UserRole } from "@/modules/user/domain/enums/UserRole";
import bcrypt from "bcrypt";
// Importamos la función con su nombre real directamente
import { getCurrentRole } from "@/shared/auth/userCurrentRole"; 

export async function POST(request: Request) {
  try {
    // Obtenemos la sesión usando el nombre correcto de la función
    const session = await getCurrentRole(); 

    // VALIDACIÓN ESTRICTA: Verificamos si la sesión existe 
    // y si la propiedad 'rol' coincide exactamente con el Enum de ADMIN
    if (!session || session.rol !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Solo un Administrador puede crear cuentas privilegiadas." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      role, 
      firstName, 
      lastName, 
      email, 
      phone, 
      password 
    } = body;

    if (!role || !firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios para el registro interno." },
        { status: 400 }
      );
    }

    let assignedRole: UserRole;

    if (role === "ADMIN" || role === UserRole.ADMIN) {
      assignedRole = UserRole.ADMIN;
    } else if (role === "STAFF" || role === UserRole.STAFF) {
      assignedRole = UserRole.STAFF;
    } else {
      return NextResponse.json(
        { success: false, message: "Este endpoint es exclusivo para la creación de Administradores o Staff." },
        { status: 400 } 
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await UserContainer.createUserUseCase.execute({
      role: assignedRole,
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashedPassword,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: `Usuario ${role} creado exitosamente por el administrador.`,
        data: result
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("[ADMIN REGISTER ERROR]:", error);
    
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