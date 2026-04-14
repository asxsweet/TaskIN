import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { workCreateSchema } from "@/lib/validations";
import { uploadWorkFile } from "@/lib/minio";
import { checkPlagiarism } from "@/lib/ithenticate";
import { indexWork } from "@/lib/elasticsearch";
import { notifySupervisorAssigned } from "@/lib/email";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const type = searchParams.get("type") || undefined;
    const dept = searchParams.get("departmentId") || undefined;
    const year = searchParams.get("year");
    const lang = searchParams.get("lang") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const authorId = searchParams.get("authorId");
    const supervisorId = searchParams.get("supervisorId");

    const where: Prisma.WorkWhereInput = { deletedAt: null };
    if (user.role !== "ADMIN") {
      if (status === "PENDING" && user.role === "SUPERVISOR") {
        where.supervisorId = user.id;
      }
    }
    if (type) where.type = type as never;
    if (dept) where.departmentId = dept;
    if (year) where.year = Number(year);
    if (lang) where.language = lang as never;
    if (status) where.status = status as never;
    if (authorId === "me") where.authorId = user.id;
    else if (authorId) where.authorId = authorId;
    if (supervisorId) where.supervisorId = supervisorId;

    if (search?.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { abstract: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.WorkOrderByWithRelationInput = { createdAt: order };
    if (sort === "year") orderBy = { year: order };
    if (sort === "views") orderBy = { viewCount: order };
    if (sort === "title") orderBy = { title: order };

    const [total, works] = await prisma.$transaction([
      prisma.work.count({ where }),
      prisma.work.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          keywords: true,
          author: true,
          department: { include: { faculty: true } },
          supervisor: true,
          downloads: true,
          reviews: true,
        },
      }),
    ]);

    const items = works.map((w) => {
      const avg =
        w.reviews.length > 0 ?
          w.reviews.reduce((s, r) => s + r.overallScore, 0) / w.reviews.length
        : null;
      return {
        id: w.id,
        title: w.title,
        abstract: w.abstract,
        type: w.type,
        year: w.year,
        language: w.language,
        status: w.status,
        viewCount: w.viewCount,
        fileSize: w.fileSize,
        pageCount: w.pageCount,
        plagiarismScore: w.plagiarismScore,
        createdAt: w.createdAt.toISOString(),
        author: { id: w.author.id, name: w.author.name, avatar: w.author.avatar },
        faculty: { id: w.department.faculty.id, name: w.department.faculty.name },
        department: { id: w.department.id, name: w.department.name },
        supervisor: w.supervisor ? { id: w.supervisor.id, name: w.supervisor.name } : null,
        keywords: w.keywords.map((k) => ({ id: k.id, name: k.name })),
        avgRating: avg,
        downloadCount: w.downloads.length,
      };
    });

    return NextResponse.json({ total, page, limit, items });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const metaRaw = form.get("metadata");
    if (typeof metaRaw !== "string") {
      return NextResponse.json({ error: "metadata required" }, { status: 400 });
    }
    const meta = workCreateSchema.parse(JSON.parse(metaRaw));
    const buf = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";
    const originalName = (file as File).name || "upload.bin";

    let path: string;
    let size: number;
    try {
      const up = await uploadWorkFile(buf, originalName, mime);
      path = up.path;
      size = up.size;
    } catch {
      return NextResponse.json(
        {
          error:
            "Файл сақтау сәтсіз (MinIO/S3). MINIO_* орталықтары мен npm run minio:init орындалғанын тексеріңіз.",
        },
        { status: 503 }
      );
    }

    let pageCount: number | null = null;
    if (originalName.toLowerCase().endsWith(".pdf")) {
      try {
        const mod = await import("pdf-parse");
        const pdfParse = (mod as { default?: (b: Buffer) => Promise<{ numpages: number }> }).default ?? (mod as unknown as (b: Buffer) => Promise<{ numpages: number }>);
        const parsed = await pdfParse(buf);
        pageCount = parsed.numpages || null;
      } catch {
        pageCount = null;
      }
    }

    const plagiarismScore = await checkPlagiarism(buf, originalName);

    const keywordNames = meta.keywordNames ?? [];
    const keywords = await Promise.all(
      keywordNames.map(async (name) => {
        const existing = await prisma.keyword.findFirst({
          where: { name: { equals: name, mode: "insensitive" } },
        });
        if (existing) return { id: existing.id };
        return prisma.keyword.create({ data: { name } });
      })
    );

    const work = await prisma.work.create({
      data: {
        title: meta.title,
        abstract: meta.abstract,
        type: meta.type,
        year: meta.year,
        language: meta.language,
        filePath: path,
        fileSize: size,
        pageCount,
        plagiarismScore,
        authorId: user.id,
        supervisorId: meta.supervisorId ?? undefined,
        departmentId: meta.departmentId,
        status: "PENDING",
        keywords: { connect: keywords.map((k) => ({ id: k.id })) },
      },
      include: { supervisor: true },
    });

    if (work.supervisor?.email) {
      await notifySupervisorAssigned(work.supervisor.email, work.title);
    }

    await indexWork(work.id).catch(() => undefined);

    return NextResponse.json({
      id: work.id,
      title: work.title,
      fileSize: work.fileSize,
      pageCount: work.pageCount,
      plagiarismScore: work.plagiarismScore,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof ZodError) {
      const first = e.issues[0];
      const message = first?.message || "Деректер дұрыс емес";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
