import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      [key: string]: any; // Allows access to all properties dynamically
    };
  }
  interface User {
    [key: string]: any; // Allows storing the full user object
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/employer/signin",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new AuthError("Email and password are required");
          }

          if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
            throw new Error("Backend URL is not configured");
          }

          const { callbackUrl, ...loginCredentials } = credentials as any;

          const login = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(loginCredentials),
            signal: AbortSignal.timeout(10000),
          });

          const loginResponse = await login.json();

          if (!login.ok || !loginResponse.success) {
            throw new AuthError(loginResponse.message || "Login failed");
          }

          // Return user object based on the API response
          // return {
          //   data: loginResponse,
          //   token: loginResponse.token,
          // };
          // console.log("====================================");
          // console.log({ loginResponse });
          return { ...loginResponse.data, loginResponse, token: loginResponse.token };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof AuthError) {
            throw error;
          }
          throw new AuthError(error instanceof Error ? error.message : "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Update token with user data
        token.user = user;
        // token.user = {
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        //   token: user.token,
        // };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // if (token.user) {
      // console.log("====================================");
      session.user = token.user;

      // session.user = {
      //   id: token.user.id,
      //   name: token.user.name,
      //   email: token.user.email,
      //   token: token.user.token,
      // };
      // }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    // async error(error:any) {
    //   console.error("Auth error:", error);
    // },
  },
});
