import NextAuth, { AuthError, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Linkedin from "next-auth/providers/linkedin";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      token: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  //   secret: "IsdauJWM/nHMdxgV4vgcuoEKvdVMWI4bTNAUXtECuio=",
  providers: [
    // Google,
    // Linkedin,
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!credentials) {
            throw new Error("Credentials not found");
          }

          const data = await response.json();
          // console.log("Data", data);

          if (data.success) {
            console.log("Dataaaaa");
            return data;
          }
          if (data.error) {
            console.log("Errorrrrr", data.message);
            throw new AuthError(data.message);
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt(token) {
      // console.log(token);
      return token;
    },
    async session({ token, session }: any) {
      // // print email and name
      // console.log("email", session?.user.email);
      // console.log("user", session?.user.name);

      // console.log("token", token);
      // console.log("session", session);

      return token;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
