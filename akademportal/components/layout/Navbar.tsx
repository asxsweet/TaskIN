"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

type Site = { siteName?: string | null; tagline?: string | null };

export function Navbar({ site }: { site?: Site | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-20 xl:px-24 h-16 flex items-center justify-between gap-4">
        <Logo href="/" />
        {site?.tagline ?
          <p className="hidden lg:block text-xs text-neutral-500 max-w-xs truncate dark:text-neutral-400">{site.tagline}</p>
        : null}
        <button
          type="button"
          className="md:hidden rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          aria-expanded={open}
          aria-label={open ? "Мәзірді жабу" : "Мәзірді ашу"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
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
      {open ?
        <div className="md:hidden border-t border-neutral-100 bg-white/95 px-6 py-4 flex flex-col gap-3 text-sm font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-200">
          <Link href="/search" className="py-2 hover:text-primary" onClick={() => setOpen(false)}>
            Іздеу
          </Link>
          <Link href="/upload" className="py-2 hover:text-primary" onClick={() => setOpen(false)}>
            Жүктеу
          </Link>
          <Link href="/auth" className="py-2 hover:text-primary" onClick={() => setOpen(false)}>
            Кіру
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full">
              Басты бет
            </Button>
          </Link>
        </div>
      : null}
    </header>
  );
}
