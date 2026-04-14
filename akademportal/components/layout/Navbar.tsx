import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

type Site = { siteName?: string | null; tagline?: string | null };

export function Navbar({ site }: { site?: Site | null }) {
  return (
    <header className="border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-20 h-16 flex items-center justify-between gap-4">
        <Logo href="/" />
        {site?.tagline ?
          <p className="hidden lg:block text-xs text-neutral-500 max-w-xs truncate">{site.tagline}</p>
        : null}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/search" className="hover:text-primary transition-colors">
            Іздеу
          </Link>
          <Link href="/upload" className="hover:text-primary transition-colors">
            Жүктеу
          </Link>
          <Link href="/auth" className="hover:text-primary transition-colors">
            Кіру
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Басты бет</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
