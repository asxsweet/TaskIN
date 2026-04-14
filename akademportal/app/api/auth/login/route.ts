import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";
import { loginSchema } from "@/lib/validations";
import { signAccessToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = loginSchema.parse(json);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (user.role === R.SUPERVISOR) {
      if (user.approvalStatus === A.PENDING) {
        return NextResponse.json({ error: "Өтініміңіз әлі қаралмады. Күте тұрыңыз." }, { status: 403 });
      }
      if (user.approvalStatus === A.REJECTED) {
        return NextResponse.json(
          { error: `Өтініміңіз қабылданбады: ${user.approvalNote || ""}`.trim() },
          { status: 403 }
        );
      }
    }
    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        facultyId: user.facultyId,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
