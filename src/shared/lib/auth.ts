import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AuthContainer } from "@modules/auth/container/AuthContainer";

export const { handlers, auth, signIn, signOut } = NextAuth({

    session: {

        strategy: "jwt"

    },

    providers: [

        Credentials({

            credentials: {

                email: { label: "Email", type: "email" },

                password: { label: "Password", type: "password" }

            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {

                    return null;

                }

                try {

                    const controller =
                        AuthContainer.getAuthController();

                    const session =
                        await controller.login({

                            email: credentials.email as string,

                            password: credentials.password as string

                        });

                    return {

                        id: session.user.id,

                        email: session.user.email,

                        role: session.user.role,

                        status: session.user.status

                    };

                }

                catch {

                    return null;

                }

            }

        })

    ],

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

        }

    }

});