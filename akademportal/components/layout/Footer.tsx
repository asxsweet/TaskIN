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
    <footer className="border-t border-neutral-200 py-16 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">
              {site?.siteName ?? "Task IN"}
              {site?.tagline ? ` — ${site.tagline}` : ""}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Сілтемелер</h4>
            <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
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
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Байланыс</h4>
            <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
              <li>{site?.contactEmail}</li>
              <li>{site?.contactPhone}</li>
              <li>{site?.contactAddress}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Әлеуметтік желілер</h4>
            <div className="flex gap-4">
              {(site?.socialLinks ?? []).filter((s) => s.url?.trim()).map((s) => (
                <a
                  key={`${s.label}-${s.url}`}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-2 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white text-xs transition-colors dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          © {new Date().getFullYear()} {site?.siteName ?? "Task IN"}. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
