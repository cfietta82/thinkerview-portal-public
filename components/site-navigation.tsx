"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenText, FileText, Home, LibraryBig, MessageSquareText } from "lucide-react";

const mainLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/resumes", label: "Interviews", icon: FileText },
  { href: "/analyse", label: "Analyse", icon: BarChart3 },
];

const analysisLinks = [
  { href: "/analyse/conseils", label: "Conseils", icon: MessageSquareText },
  { href: "/analyse/recommandations", label: "Lectures", icon: BookOpenText },
  { href: "/analyse/evolution", label: "Évolution", icon: BarChart3 },
  { href: "/analyse/synthese", label: "Synthèse", icon: LibraryBig },
];

export function SiteNavigation() {
  const pathname = usePathname();
  const inAnalysis = pathname === "/analyse" || pathname.startsWith("/analyse/");

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-[#090807]/95 text-stone-100 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-amber-200/50 bg-amber-200 text-sm font-black text-stone-950">T</span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-white">Thinkerview</span>
            <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">Corpus Portal</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-2">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(link.href + "/") || (link.href === "/resumes" && pathname.startsWith("/interviews/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "inline-flex items-center gap-2 border px-3 py-2 text-sm font-medium transition",
                  active ? "border-amber-300 bg-amber-200 text-stone-950" : "border-stone-800 bg-stone-950/70 text-stone-300 hover:border-stone-600 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {inAnalysis ? (
        <div className="border-t border-stone-800 bg-black/20">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-2 md:px-8">
            {analysisLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-sm transition",
                    active ? "border-amber-300/80 bg-amber-200/15 text-amber-100" : "border-stone-800 bg-[#11100e] text-stone-400 hover:border-stone-600 hover:text-stone-100",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
