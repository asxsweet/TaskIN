import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { workUpdateSchema } from "@/lib/validations";
import { deleteWorkFromIndex, indexWork } from "@/lib/elasticsearch";
import { notifyWorkStatus } from "@/lib/email";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { id } = await ctx.params;
    const work = await prisma.work.findFirst({
      where: { id, deletedAt: null },
      include: {
        keywords: true,
        author: { include: { faculty: true } },
        department: { include: { faculty: true } },
        supervisor: true,
        downloads: true,
        reviews: {
          include: { reviewer: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role === "SUPERVISOR" && work.supervisorId && work.supervisorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (work.status !== "APPROVED" && user.role === "STUDENT" && work.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const avg =
      work.reviews.length > 0 ?
        work.reviews.reduce((s, r) => s + r.overallScore, 0) / work.reviews.length
      : null;

    const similar = await prisma.work.findMany({
      where: {
        id: { not: work.id },
        deletedAt: null,
        status: "APPROVED",
        type: work.type,
        department: { facultyId: work.department.facultyId },
      },
      orderBy: { viewCount: "desc" },
      take: 6,
      include: {
        keywords: true,
        author: true,
        department: { include: { faculty: true } },
        supervisor: true,
        downloads: true,
      },
    });

    return NextResponse.json({
      work: {
        id: work.id,
        title: work.title,
        abstract: work.abstract,
        type: work.type,
        year: work.year,
        language: work.language,
        status: work.status,
        viewCount: work.viewCount,
        fileSize: work.fileSize,
        pageCount: work.pageCount,
        plagiarismScore: work.plagiarismScore,
        filePath: work.filePath,
        createdAt: work.createdAt.toISOString(),
        updatedAt: work.updatedAt.toISOString(),
        author: {
          id: work.author.id,
          name: work.author.name,
          avatar: work.author.avatar,
          faculty: work.author.faculty,
        },
        faculty: work.department.faculty,
        department: work.department,
        supervisor: work.supervisor,
        keywords: work.keywords,
        downloads: work.downloads.length,
        avgRating: avg,
        reviews: work.reviews.map((r) => ({
          id: r.id,
          relevance: r.relevance,
          methodology: r.methodology,
          formatting: r.formatting,
          conclusion: r.conclusion,
          overallScore: r.overallScore,
          strengths: r.strengths,
          suggestions: r.suggestions,
          comment: r.comment,
          decision: r.decision,
          helpfulCount: r.helpfulCount,
          createdAt: r.createdAt.toISOString(),
          reviewer: { id: r.reviewer.id, name: r.reviewer.name },
        })),
      },
      similar: similar.map((w) => ({
        id: w.id,
        title: w.title,
        abstract: w.abstract,
        type: w.type,
        year: w.year,
        language: w.language,
        viewCount: w.viewCount,
        downloads: w.downloads.length,
        authorName: w.author.name,
        facultyName: w.department.faculty.name,
        supervisorName: w.supervisor?.name ?? null,
        keywords: w.keywords.map((k) => k.name),
        createdAt: w.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { id } = await ctx.params;
    const work = await prisma.work.findFirst({ where: { id, deletedAt: null } });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const json = await req.json();
    const data = workUpdateSchema.parse(json);

    if (user.role === "ADMIN" && data.status) {
      const updated = await prisma.work.update({
        where: { id },
        data: {
          status: data.status,
          title: data.title,
          abstract: data.abstract,
          type: data.type,
          year: data.year,
          language: data.language,
          departmentId: data.departmentId,
          supervisorId: data.supervisorId ?? undefined,
        },
      });
      if (updated.authorId) {
        const author = await prisma.user.findUnique({ where: { id: updated.authorId } });
        if (author?.email) await notifyWorkStatus(author.email, updated.title, updated.status);
      }
      await indexWork(updated.id).catch(() => undefined);
      return NextResponse.json({ ok: true });
    }

    if (work.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.work.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        abstract: data.abstract ?? undefined,
        type: data.type ?? undefined,
        year: data.year ?? undefined,
        language: data.language ?? undefined,
        departmentId: data.departmentId ?? undefined,
        supervisorId: data.supervisorId === null ? null : data.supervisorId,
      },
    });
    await indexWork(updated.id).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const message = e instanceof Error ? e.message : "Invalid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await ctx.params;
    await prisma.work.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await deleteWorkFromIndex(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
