import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hitRateLimit } from "@/lib/rate-limit";
import { isStateChanging } from "@/lib/security";

const ROLE_HOME: Record<string, string> = {
  STUDENT: "/dashboard",
  SUPERVISOR: "/supervisor",
  ADMIN: "/admin",
};

function starts(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (starts(pathname, "/api")) {
    const baseKey = `${ip}:${pathname}:${req.method}`;
    const strict =
      starts(pathname, "/api/auth/login") ||
      starts(pathname, "/api/auth/register") ||
      starts(pathname, "/api/works");
    const limit = hitRateLimit(baseKey, {
      max: strict ? 20 : 120,
      windowMs: 60_000,
    });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Too many requests. Қайтадан сәл кейінірек көріңіз." },
        { status: 429 }
      );
    }
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  /** Must match how the session cookie was named for this request (http vs https), not only NEXTAUTH_URL. */
  const secureCookie = req.nextUrl.protocol === "https:";
  const token = await getToken({ req, secret, secureCookie });
  const role = (token?.role as string | undefined) ?? undefined;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/auth")) {
    if (role) {
      const home = ROLE_HOME[role] ?? "/dashboard";
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  const isPublicApi =
    starts(pathname, "/api/auth") ||
    starts(pathname, "/api/public") ||
    pathname === "/api/site";

  if (isPublicApi) {
    return NextResponse.next();
  }

  if (starts(pathname, "/api") && isStateChanging(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host) {
      const expected = `${req.nextUrl.protocol}//${host}`;
      if (origin !== expected) {
        return NextResponse.json({ error: "CSRF blocked" }, { status: 403 });
      }
    }
  }

  if (!role) {
    if (starts(pathname, "/api")) {
      return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    }
    const signIn = new URL("/auth", req.url);
    signIn.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(signIn);
  }

  const home = ROLE_HOME[role] ?? "/dashboard";

  if (role === "SUPERVISOR" && pathname === "/settings") {
    return NextResponse.redirect(new URL("/supervisor/settings", req.url));
  }
  if (role === "ADMIN" && pathname === "/settings") {
    return NextResponse.redirect(new URL("/admin/settings", req.url));
  }
  if (pathname === "/profile") {
    if (role === "SUPERVISOR") {
      return NextResponse.redirect(new URL("/supervisor/profile", req.url));
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (starts(pathname, "/api/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/api/supervisor")) {
    if (role !== "SUPERVISOR" && role !== "ADMIN") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/api/student")) {
    if (role !== "STUDENT") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/api/stats")) {
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }
    return NextResponse.next();
  }

  const studentPaths = [
    "/dashboard",
    "/profile",
    "/search",
    "/works",
    "/upload",
    "/my-works",
    "/bookmarks",
    "/settings",
    "/notifications",
  ];
  const isStudentPage = studentPaths.some((p) => starts(pathname, p));

  if (isStudentPage) {
    if (role !== "STUDENT") {
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/supervisor")) {
    if (role !== "SUPERVISOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  if (starts(pathname, "/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
