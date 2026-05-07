import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { z } from "zod";
import { hasStrongPassword } from "@/lib/security";

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  currentPassword: z.string().min(1, "Ағымдағы құпиясөз керек"),
  newPassword: z.string().min(8, "Жаңа құпиясөз кемінде 8 таңба болуы керек").max(128),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    if (me.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const json = await req.json();
    const data = bodySchema.parse(json);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const ok = await bcrypt.compare(data.currentPassword, user.password);
    if (data.currentPassword === data.newPassword) {
      return NextResponse.json(
        { error: "Жаңа құпиясөз ағымдағы құпиясөзбен бірдей болмауы керек" },
        { status: 400 }
      );
    }
    if (!hasStrongPassword(data.newPassword)) {
      return NextResponse.json(
        {
          error:
            "Құпиясөз кемінде 10 таңба, үлкен/кіші әріп, сан және арнайы таңба қамтуы керек",
        },
        { status: 400 }
      );
    }

    if (!ok) {
      return NextResponse.json({ error: "Ағымдағы құпиясөз қате" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id },
      data: { password: newHash },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof z.ZodError) {
      const msg = e.issues[0]?.message ?? "Деректер қате";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
