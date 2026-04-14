import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-user";
import { searchWorks } from "@/lib/elasticsearch";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const rawType = searchParams.get("type") || undefined;
    const types = rawType?.includes(",") ? rawType.split(",").filter(Boolean) : undefined;
    const singleType = rawType && !rawType.includes(",") ? rawType : undefined;
    const rawFaculty = searchParams.get("faculty") || undefined;
    const faculties = rawFaculty?.includes(",") ? rawFaculty.split(",").filter(Boolean) : undefined;
    const singleFaculty = rawFaculty && !rawFaculty.includes(",") ? rawFaculty : undefined;
    const year = searchParams.get("year");
    const lang = searchParams.get("lang") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 12);

    const result = await searchWorks({
      q,
      type: singleType,
      types,
      facultyId: singleFaculty,
      facultyIds: faculties,
      year: year ? Number(year) : undefined,
      lang,
      sort,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
