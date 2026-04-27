// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  // This callback ensures we know if the logged-in user is a STUDENT or VENDOR
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-ignore - We will fix the strict TypeScript typing for this later
        session.user.role = user.role; 
        // @ts-ignore
        session.user.id = user.id;
        session.user.phone = (user as any).phone;
      }
      return session;
    }
  }
})