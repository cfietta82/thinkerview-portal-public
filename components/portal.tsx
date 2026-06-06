"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import type { Interview, PortalData } from "@/types/portal";

const themeLabels: Record<string, string> = {
  democratie: "Démocratie",
  economie: "Économie",
  ecologie: "Écologie",
  geopolitique: "Géopolitique",
  numerique: "Numérique",
  societe: "Société"
};

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function searchableText(interview: Interview) {
  return [
    interview.title,
    interview.guest,
    interview.role,
    interview.themes.join(" "),
    interview.executive_summary,
    interview.sections.map((section) => `${section.title} ${section.paragraphs.join(" ")}`).join(" ")
  ].join(" ").toLowerCase();
}

export function Portal({ data }: { data: PortalData }) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("all");

  const themes = useMemo(() => {
    const values = new Set<string>();
    for (const interview of data.interviews) {
      for (const item of interview.themes) values.add(item);
    }
    return [...values].sort();
  }, [data.interviews]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.interviews.filter((interview) => {
      if (theme !== "all" && !interview.themes.includes(theme)) return false;
      if (!normalized) return true;
      return searchableText(interview).includes(normalized);
    });
  }, [data.interviews, query, theme]);

  const transcriptReady = data.interviews.filter((interview) => interview.transcript.available).length;
  const totalHours = Math.round(data.interviews.reduce((acc, interview) => acc + interview.duration_seconds, 0) / 3600);

  return (
    <main>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(217,184,108,0.18),transparent_32%),linear-gradient(135deg,#111111,#181713_42%,#101717)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-amber-200/30 bg-amber-100/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
                <Sparkles className="h-3.5 w-3.5" />
                Thinkerview Knowledge Portal
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-stone-50 md:text-6xl">
                Une page premium par interview.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                Cartouches invités, thèmes, durée, résumés structurés et lecture longue à partir des transcripts publics de la chaîne.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Interviews" value={data.interviews.length.toString()} />
              <Metric label="Transcripts" value={`${transcriptReady}/${data.interviews.length}`} />
              <Metric label="Heures couvertes" value={`${totalHours}h`} />
            </div>
          </div>

          <div className="grid content-end gap-4">
            {data.interviews.slice(0, 3).map((interview) => (
              <Link
                href={`/interviews/${interview.slug}`}
                key={interview.id}
                className="group grid grid-cols-[112px_1fr] gap-4 border border-white/12 bg-white/[0.06] p-3 transition hover:border-amber-200/60 hover:bg-white/[0.09]"
              >
                <Image src={interview.thumbnail} alt="" width={336} height={188} unoptimized className="aspect-video h-full w-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-amber-100">{interview.guest}</p>
                  <h2 className="mt-1 line-clamp-2 text-sm font-medium text-stone-50">{interview.title}</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs text-stone-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {interview.publish_date ?? "Date à préciser"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-3 border border-stone-800 bg-stone-950/80 p-4 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher invité, thème, idée..."
              className="h-10 w-full border border-stone-800 bg-stone-900 pl-10 pr-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-300"
            />
          </label>
          <label className="relative block">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="h-10 w-full appearance-none border border-stone-800 bg-stone-900 pl-10 pr-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            >
              <option value="all">Tous les thèmes</option>
              {themes.map((item) => (
                <option value={item} key={item}>{themeLabels[item] ?? item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-amber-200/80">Catalogue</p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-50">{filtered.length} interviews</h2>
          </div>
          <p className="max-w-xl text-sm text-stone-400">
            Les pages peuvent recevoir des résumés éditoriaux longs générés depuis transcripts. La note méthodologique reste visible pour distinguer contenu validé et transcript indisponible.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((interview) => (
            <Link
              href={`/interviews/${interview.slug}`}
              key={interview.id}
              className="group grid gap-4 border border-stone-800 bg-stone-950 p-4 transition hover:border-amber-300/60 hover:bg-stone-900 sm:grid-cols-[180px_1fr]"
            >
              <Image src={interview.thumbnail} alt="" width={336} height={188} unoptimized className="aspect-video w-full object-cover" />
              <article className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {interview.themes.slice(0, 3).map((item) => (
                    <span className="border border-teal-300/20 bg-teal-200/10 px-2 py-1 text-xs text-teal-100" key={item}>
                      {themeLabels[item] ?? item}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-stone-50">{interview.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-400">
                  <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{interview.guest}</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{interview.publish_date ?? "Date à préciser"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{interview.duration}</span>
                  <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{formatNumber(interview.transcript.words)} mots</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />{percent(interview.confidence)}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-300">{interview.executive_summary}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-amber-200">
                  Ouvrir la page <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/12 bg-white/[0.06] p-4">
      <p className="text-2xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-400">{label}</p>
    </div>
  );
}
