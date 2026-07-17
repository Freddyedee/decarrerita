import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthContainer } from "@modules/auth/container/AuthContainer";
import { authConfig } from "./Auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                try {
                    const controller = AuthContainer.getAuthController();
                    const session = await controller.login({
                        email: credentials.email as string,
                        password: credentials.password as string,
                    });
                    return {
                        id: session.user.id,
                        email: session.user.email,
                        role: session.user.role,
                        status: session.user.status,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
});