import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    providers: [], // los providers reales solo se agregan en auth.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.status = token.status;
            return session;
        },
    },
};