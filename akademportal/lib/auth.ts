import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/auth" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        if (user.role === R.SUPERVISOR) {
          if (user.approvalStatus === A.PENDING) {
            throw new Error("Өтініміңіз әлі қаралмады");
          }
          if (user.approvalStatus === A.REJECTED) {
            throw new Error(`Өтініміңіз қабылданбады: ${user.approvalNote || ""}`.trim());
          }
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          approvalStatus: user.approvalStatus,
          approvalNote: user.approvalNote,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
        token.approvalStatus = (user as { approvalStatus?: string }).approvalStatus;
        token.approvalNote = (user as { approvalNote?: string | null }).approvalNote;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.approvalStatus = token.approvalStatus as string | undefined;
        session.user.approvalNote = token.approvalNote as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
