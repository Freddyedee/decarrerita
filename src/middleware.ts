// src/middleware.ts
import { auth } from "@/shared/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/registro"];

export default auth((req) => {

    const { pathname } = req.nextUrl;

    const isPublic = publicRoutes.includes(pathname);

    if (!isPublic && !req.auth) {

        const loginUrl = new URL("/login", req.nextUrl.origin);

        return NextResponse.redirect(loginUrl);

    }

    return NextResponse.next();

});

export const config = {

    matcher: [

        "/((?!api|_next/static|_next/image|favicon.ico).*)"

    ]

};