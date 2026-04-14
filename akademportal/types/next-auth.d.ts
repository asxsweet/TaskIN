import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      approvalStatus?: string;
      approvalNote?: string | null;
    };
  }

  interface User {
    role: string;
    approvalStatus?: string;
    approvalNote?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    approvalStatus?: string;
    approvalNote?: string | null;
  }
}
