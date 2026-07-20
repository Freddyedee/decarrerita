import { NextResponse } from "next/server";
import { UserContainer } from "@/shared/container/UserContainer";
import { UserRole } from "@/modules/user/domain/enums/UserRole";
import bcrypt from "bcrypt"; // O 'bcryptjs' si tienes problemas en el entorno Edge de Next.js

export async function POST(request: Request) {
  try {
    // 1. Parseo de los datos enviados desde el frontend o cURL
    const body = await request.json();
    const { 
      role, // Puede venir como string "CLIENT" o número 1
      firstName, 
      lastName, 
      email, 
      phone, 
      password, // Contraseña en texto plano
      licenseNumber, 
      bankId 
    } = body;

    // 2. Validación de campos base obligatorios
    if (!role || !firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios para el registro base." },
        { status: 400 }
      );
    }

    // 3. Mapeo y validación estricta de Roles (Bloqueo de ADMIN y STAFF)
    let assignedRole: UserRole;

    if (role === "CLIENTE" || role === UserRole.CLIENT) {
      assignedRole = UserRole.CLIENT;
    } else if (role === "CHOFER" || role === UserRole.DRIVER) {
      assignedRole = UserRole.DRIVER;
      
      // Validaciones tempranas específicas para el chofer
      if (!licenseNumber) {
        return NextResponse.json(
          { success: false, message: "La licencia es obligatoria para registrar un chofer." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Rol inválido o no permitido en esta ruta pública." },
        { status: 403 } // 403 Forbidden para evitar creación de Admins
      );
    }

    // 4. Encriptación de la contraseña (Capa de Presentación / Controlador)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Ejecución del Caso de Uso Único
    const result = await UserContainer.createUserUseCase.execute({
      role: assignedRole,
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashedPassword,
      licenseNumber: assignedRole === UserRole.DRIVER ? licenseNumber : undefined,
      bankId: assignedRole === UserRole.DRIVER ? bankId : undefined,
    });

    // 6. Respuesta exitosa
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
    
    // 1. Verificamos de forma segura si el error es una instancia nativa de Error
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Ocurrió un error interno al procesar el registro.";

    // 2. Detectamos si es un error de regla de negocio de tu dominio
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