import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";
import { loginSchema } from "@/lib/validations";

/** Password дұрыс болғанда ғана supervisor approval себебін қайтарады (кіру қатесі үшін). */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = loginSchema.parse(json);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!user) {
      return NextResponse.json({ status: "invalid" as const });
    }
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) {
      return NextResponse.json({ status: "invalid" as const });
    }
    if (user.role === R.SUPERVISOR) {
      if (user.approvalStatus === A.PENDING) {
        return NextResponse.json({
          status: "pending" as const,
          message: "Өтініміңіз әлі қаралмады. Күте тұрыңыз.",
        });
      }
      if (user.approvalStatus === A.REJECTED) {
        return NextResponse.json({
          status: "rejected" as const,
          message: `Өтініміңіз қабылданбады: ${user.approvalNote || ""}`.trim(),
          note: user.approvalNote,
        });
      }
    }
    return NextResponse.json({ status: "ok" as const });
  } catch {
    return NextResponse.json({ status: "invalid" as const }, { status: 400 });
  }
}
