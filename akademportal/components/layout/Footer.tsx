import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function Footer({
  site,
}: {
  site: {
    siteName?: string | null;
    tagline?: string | null;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    socialLinks: { label: string; url: string }[];
  } | null;
}) {
  return (
    <footer className="border-t border-neutral-200 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {site?.siteName ?? "Task IN"}
              {site?.tagline ? ` — ${site.tagline}` : ""}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Сілтемелер</h4>
            <ul className="space-y-4 text-sm text-neutral-600">
              <li>
                <Link href="/search" className="hover:text-primary">
                  Іздеу
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-primary">
                  Жүктеу
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Байланыс</h4>
            <ul className="space-y-4 text-sm text-neutral-600">
              <li>{site?.contactEmail}</li>
              <li>{site?.contactPhone}</li>
              <li>{site?.contactAddress}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Әлеуметтік желілер</h4>
            <div className="flex gap-4">
              {(site?.socialLinks ?? []).filter((s) => s.url?.trim()).map((s) => (
                <a
                  key={`${s.label}-${s.url}`}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-2 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white text-xs transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-400">
          © {new Date().getFullYear()} {site?.siteName ?? "Task IN"}. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
