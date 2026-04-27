// next-auth.d.ts
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string; // 👈 This is the magic line that fixes your error!
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}