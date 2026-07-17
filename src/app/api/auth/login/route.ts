// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { AuthContainer } from "@modules/auth/container/AuthContainer";

/**
 * ============================================================
 * LOGIN REAL — reemplaza la capa de next-auth
 * ============================================================
 *
 * Reutiliza el LoginUseCase real del compañero de equipo
 * (validación con bcrypt contra la BD), pero en vez de delegar
 * la sesión a next-auth (que generaba inconsistencias de
 * configuración), se firma un JWT propio y simple con `jose`,
 * guardado en una cookie httpOnly.
 * ============================================================
 */

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const controller = AuthContainer.getAuthController();
    const session = await controller.login({ email, password });

    const token = await new SignJWT({
      userId: session.user.id,
      role: session.user.role
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

      const landingPorRol: Record<number, string> = {
      3: "/tarifas",     // ADMIN
      4: "/reportes",    // STAFF (si sigue existiendo como rol separado)
      1: "/dashboard",   // CLIENT
      2: "/traslados"    // DRIVER
};

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: session.user.id, email: session.user.email, role: session.user.role },
      redirectTo: landingPorRol[session.user.role] ?? "/login"

    });

    response.cookies.set("session_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2 // 2 horas, igual que la expiración del JWT
    });

    return response;



  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 401 }
    );
  }

  
}