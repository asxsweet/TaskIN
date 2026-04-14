import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";
import { z } from "zod";
import { registerSchema } from "@/lib/validations";
import { notifyAdminsNewSupervisorRequest } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = registerSchema.parse(json);
    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) {
      return NextResponse.json({ error: "Бұл email бұрын тіркелген" }, { status: 400 });
    }
    const password = await bcrypt.hash(data.password, 12);

    if (data.role === "SUPERVISOR") {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId! },
        include: { faculty: true },
      });
      if (!dept) {
        return NextResponse.json(
          { error: "Кафедра табылмады. Факультет пен кафедраны қайта таңдаңыз немесе бетті жаңартыңыз." },
          { status: 400 }
        );
      }

      const user = await prisma.user.create({
        data: {
          name: data.name.trim(),
          email: data.email.toLowerCase(),
          password,
          role: R.SUPERVISOR,
          facultyId: dept.facultyId,
          departmentId: dept.id,
          position: data.position!.trim(),
          phone: data.phone!.trim(),
          employeeId: data.employeeId!.trim(),
          approvalStatus: A.PENDING,
        },
        select: { id: true, name: true, email: true, role: true },
      });

      const admins = await prisma.user.findMany({
        where: { role: R.ADMIN },
        select: { id: true, email: true },
      });

      const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
      const approvalsUrl = `${baseUrl}/admin/approvals`;

      if (admins.length > 0) {
        await prisma.$transaction(
          admins.map((a: { id: string }) =>
            prisma.notification.create({
              data: {
                userId: a.id,
                type: "SUPERVISOR_REQUEST",
                title: "Жаңа жетекші өтінімі",
                body: `${user.name} жетекші ретінде тіркелгісі келеді`,
                link: "/admin/approvals",
              },
            })
          )
        );
      }

      for (const admin of admins) {
        await notifyAdminsNewSupervisorRequest({
          adminEmail: admin.email,
          name: user.name,
          email: user.email,
          faculty: dept.faculty.name,
          position: data.position!.trim(),
          employeeId: data.employeeId!.trim(),
          submittedAt: new Date(),
          approvalsUrl,
        });
      }

      return NextResponse.json({
        success: true,
        message: "pending",
        redirect: null,
        user,
      });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        password,
        facultyId: data.facultyId!,
        role: R.STUDENT,
        approvalStatus: A.APPROVED,
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ success: true, redirect: "/dashboard", user });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const msgs = e.errors.map((err) => err.message).filter(Boolean);
      const detail = msgs.length ? msgs.join(" · ") : "Қате деректер";
      return NextResponse.json({ error: detail }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
