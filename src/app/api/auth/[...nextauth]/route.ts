// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { AuthContainer } from "@modules/auth/container/AuthContainer";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const controller = AuthContainer.getAuthController();
    const session = await controller.login({ email, password }); // reutiliza el LoginUseCase real, bcrypt incluido

    // Se firma un JWT simple con lo mínimo necesario: id y rol.
    const token = await new SignJWT({
      userId: session.user.id,
      role: session.user.role
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("session_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 401 }
    );
  }
}