import { Client } from "@elastic/elasticsearch";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const INDEX = "task-in-works";

function getClient(): Client | null {
  const url = process.env.ELASTICSEARCH_URL;
  if (!url) return null;
  return new Client({ node: url });
}

export function esAvailable() {
  return !!getClient();
}

type WorkDoc = {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  type: string;
  year: number;
  language: string;
  facultyId: string;
  facultyName: string;
  departmentId: string;
  status: string;
  authorName: string;
  viewCount: number;
  downloadCount: number;
  avgRating: number | null;
  createdAt: string;
};

export async function deleteWorkFromIndex(workId: string) {
  const client = getClient();
  if (!client) return;
  await client.delete({ index: INDEX, id: workId }).catch(() => undefined);
}

export async function indexWork(workId: string) {
  const client = getClient();
  if (!client) return;

  const work = await prisma.work.findFirst({
    where: { id: workId, deletedAt: null, status: "APPROVED" },
    include: {
      keywords: true,
      author: true,
      department: { include: { faculty: true } },
      downloads: true,
      reviews: true,
    },
  });
  if (!work) {
    await client.delete({ index: INDEX, id: workId }).catch(() => undefined);
    return;
  }

  const avg =
    work.reviews.length > 0
      ? work.reviews.reduce((s, r) => s + r.overallScore, 0) / work.reviews.length
      : null;

  const doc: WorkDoc = {
    id: work.id,
    title: work.title,
    abstract: work.abstract,
    keywords: work.keywords.map((k) => k.name),
    type: work.type,
    year: work.year,
    language: work.language,
    facultyId: work.department.facultyId,
    facultyName: work.department.faculty.name,
    departmentId: work.departmentId,
    status: work.status,
    authorName: work.author.name,
    viewCount: work.viewCount,
    downloadCount: work.downloads.length,
    avgRating: avg,
    createdAt: work.createdAt.toISOString(),
  };

  await client.index({
    index: INDEX,
    id: work.id,
    document: doc,
    refresh: true,
  });
}

export async function indexAllWorks() {
  const client = getClient();
  if (!client) {
    console.warn("ELASTICSEARCH_URL not set; skip indexing");
    return;
  }

  const exists = await client.indices.exists({ index: INDEX });
  if (!exists) {
    await client.indices.create({
      index: INDEX,
      mappings: {
        properties: {
          title: { type: "text", analyzer: "standard" },
          abstract: { type: "text", analyzer: "standard" },
          keywords: { type: "text", analyzer: "standard" },
          type: { type: "keyword" },
          year: { type: "integer" },
          language: { type: "keyword" },
          facultyId: { type: "keyword" },
          facultyName: { type: "keyword" },
          departmentId: { type: "keyword" },
          status: { type: "keyword" },
          authorName: { type: "text" },
          viewCount: { type: "integer" },
          downloadCount: { type: "integer" },
          avgRating: { type: "float" },
          createdAt: { type: "date" },
        },
      },
    });
  }

  const ids = await prisma.work.findMany({
    where: { deletedAt: null, status: "APPROVED" },
    select: { id: true },
  });
  for (const { id } of ids) {
    await indexWork(id);
  }
}

export type SearchParams = {
  q?: string;
  type?: string;
  types?: string[];
  facultyId?: string;
  facultyIds?: string[];
  year?: number;
  lang?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function searchWorks(params: SearchParams) {
  const client = getClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));
  const from = (page - 1) * pageSize;

  if (!client) {
    return prismaSearchFallback(params, page, pageSize);
  }

  const must: object[] = [{ term: { status: "APPROVED" } }];
  const filter: object[] = [];

  if (params.q?.trim()) {
    must.push({
      multi_match: {
        query: params.q.trim(),
        fields: ["title^3", "abstract", "keywords"],
        type: "best_fields",
        fuzziness: "AUTO",
      },
    });
  }
  if (params.types?.length) filter.push({ terms: { type: params.types } });
  else if (params.type) filter.push({ term: { type: params.type } });
  if (params.facultyIds?.length) filter.push({ terms: { facultyId: params.facultyIds } });
  else if (params.facultyId) filter.push({ term: { facultyId: params.facultyId } });
  if (params.year) filter.push({ term: { year: params.year } });
  if (params.lang) filter.push({ term: { language: params.lang } });

  let sortClause: object[] = [{ _score: "desc" }];
  if (params.sort === "date") sortClause = [{ createdAt: "desc" }];
  else if (params.sort === "downloads") sortClause = [{ downloadCount: "desc" }];
  else if (params.sort === "rating") sortClause = [{ avgRating: "desc" }];

  const body = {
    query: { bool: { must, filter } },
    sort: sortClause,
    from,
    size: pageSize,
    highlight:
      params.q?.trim() ?
        {
          fields: {
            title: {},
            abstract: { fragment_size: 180, number_of_fragments: 2 },
            keywords: {},
          },
        }
      : undefined,
    aggs: {
      byType: { terms: { field: "type", size: 20 } },
      byFaculty: { terms: { field: "facultyId", size: 50 } },
      byYear: { terms: { field: "year", size: 30 } },
      byLang: { terms: { field: "language", size: 10 } },
    },
  };

  const res = await client.search({
    index: INDEX,
    body: body as never,
    track_total_hits: true,
  });

  const total =
    typeof res.hits.total === "number" ? res.hits.total : res.hits.total?.value ?? 0;
  const hits = res.hits.hits.map((h) => {
    const src = h._source as WorkDoc;
    const hl = h.highlight as Record<string, string[]> | undefined;
    return {
      id: src.id,
      title: src.title,
      abstract: src.abstract,
      type: src.type,
      year: src.year,
      language: src.language,
      viewCount: src.viewCount,
      downloads: src.downloadCount,
      authorName: src.authorName,
      facultyName: src.facultyName,
      supervisorName: null as string | null,
      keywords: src.keywords,
      createdAt: src.createdAt,
      highlight: hl ?
          {
            title: hl.title,
            abstract: hl.abstract,
            keywords: hl.keywords,
          }
        : undefined,
    };
  });

  const aggs = res.aggregations as Record<string, { buckets: { key: string | number; doc_count: number }[] }>;

  return {
    total,
    page,
    pageSize,
    hits,
    aggregations: {
      types: aggs?.byType?.buckets ?? [],
      faculties: aggs?.byFaculty?.buckets ?? [],
      years: aggs?.byYear?.buckets ?? [],
      languages: aggs?.byLang?.buckets ?? [],
    },
  };
}

async function prismaSearchFallback(params: SearchParams, page: number, pageSize: number) {
  const where: Prisma.WorkWhereInput = {
    deletedAt: null,
    status: "APPROVED",
  };
  if (params.types?.length) where.type = { in: params.types as never[] };
  else if (params.type) where.type = params.type as never;
  if (params.facultyIds?.length) {
    where.department = { facultyId: { in: params.facultyIds } };
  } else if (params.facultyId) {
    where.department = { facultyId: params.facultyId };
  }
  if (params.year) where.year = params.year;
  if (params.lang) where.language = params.lang as never;
  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { abstract: { contains: q, mode: "insensitive" } },
      { keywords: { some: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }

  let orderBy: Prisma.WorkOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "downloads") orderBy = { downloads: { _count: "desc" } };
  if (params.sort === "date") orderBy = { createdAt: "desc" };
  if (params.sort === "rating") orderBy = { reviews: { _count: "desc" } };

  const [total, rows] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
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

  const facultyMap = await prisma.faculty.findMany({ select: { id: true, name: true } });
  const fById = Object.fromEntries(facultyMap.map((f) => [f.id, f.name]));

  const typeCounts = await prisma.work.groupBy({
    by: ["type"],
    where: { deletedAt: null, status: "APPROVED" },
    _count: true,
  });
  const facCounts = await prisma.work.groupBy({
    by: ["departmentId"],
    where: { deletedAt: null, status: "APPROVED" },
    _count: true,
  });
  const deps = await prisma.department.findMany({ select: { id: true, facultyId: true } });
  const depToFac = Object.fromEntries(deps.map((d) => [d.id, d.facultyId]));
  const facultyAgg: Record<string, number> = {};
  for (const fc of facCounts) {
    const fid = depToFac[fc.departmentId];
    if (fid) facultyAgg[fid] = (facultyAgg[fid] ?? 0) + fc._count;
  }

  return {
    total,
    page,
    pageSize,
    hits: rows.map((w) => ({
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
      highlight: undefined,
    })),
    aggregations: {
      types: typeCounts.map((t) => ({ key: t.type, doc_count: t._count })),
      faculties: Object.entries(facultyAgg).map(([key, doc_count]) => ({
        key,
        doc_count,
        name: fById[key],
      })),
      years: [],
      languages: [],
    },
  };
}
