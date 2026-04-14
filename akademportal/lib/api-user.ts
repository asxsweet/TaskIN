import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";

export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      return user;
    } catch {
      return null;
    }
  }

  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}

export async function requireUser(req: NextRequest): Promise<User> {
  const user = await getUserFromRequest(req);
  if (!user) {
    const err = new Error("UNAUTHORIZED") as Error & { status: number };
    err.status = 401;
    throw err;
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<User> {
  const user = await requireUser(req);
  if (user.role !== "ADMIN") {
    const err = new Error("FORBIDDEN") as Error & { status: number };
    err.status = 403;
    throw err;
  }
  return user;
}

export async function requireStudent(req: NextRequest): Promise<User> {
  const user = await requireUser(req);
  if (user.role !== "STUDENT") {
    const err = new Error("FORBIDDEN") as Error & { status: number };
    err.status = 403;
    throw err;
  }
  return user;
}

/** Жетекші немесе әкімші (тексеру API). */
export async function requireSupervisorOrAdmin(req: NextRequest): Promise<User> {
  const user = await requireUser(req);
  if (user.role !== "SUPERVISOR" && user.role !== "ADMIN") {
    const err = new Error("FORBIDDEN") as Error & { status: number };
    err.status = 403;
    throw err;
  }
  return user;
}
