"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, FileText, Search, ShieldCheck, UserRound, X } from "lucide-react";
import type { Interview, PortalData } from "@/types/portal";
import { corpusMetrics, interviewYear, themeLabels } from "@/lib/analysis";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function searchableText(interview: Interview) {
  return [interview.title, interview.guest, interview.role, interview.themes.join(" "), interview.executive_summary, interview.sections.map((section) => `${section.title} ${section.paragraphs.join(" ")}`).join(" ")].join(" ").toLowerCase();
}

export function Portal({ data }: { data: PortalData }) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("all");
  const [year, setYear] = useState("all");

  const themes = useMemo(() => [...new Set(data.interviews.flatMap((interview) => interview.themes))].sort(), [data.interviews]);
  const years = useMemo(() => [...new Set(data.interviews.map(interviewYear).filter((item) => item !== "Date à préciser"))].sort((a, b) => b.localeCompare(a)), [data.interviews]);
  const metrics = useMemo(() => corpusMetrics(data.interviews), [data.interviews]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.interviews.filter((interview) => {
      if (theme !== "all" && !interview.themes.includes(theme)) return false;
      if (year !== "all" && interviewYear(interview) !== year) return false;
      if (!normalized) return true;
      return searchableText(interview).includes(normalized);
    });
  }, [data.interviews, query, theme, year]);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-stone-800 bg-stone-950">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <Link href="/" className="text-xs uppercase tracking-[0.24em] text-amber-200">Thinkerview Corpus</Link>
          <div className="mt-5 grid gap-8 xl:grid-cols-[1fr_520px]">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-stone-50 md:text-5xl">Résumés éditoriaux des interviews</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Un catalogue éditorial des entretiens Thinkerview : synthèses longues, thèmes consolidés, recherche par invité, année et sujet.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              <Metric value={formatNumber(metrics.interviews)} label="pages" />
              <Metric value={`${formatNumber(metrics.hours)} h`} label="corpus vidéo" />
              <Metric value={formatNumber(metrics.guests)} label="invités" />
              <Metric value={formatNumber(years.length)} label="années" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="w-full overflow-hidden border border-stone-800 bg-stone-950 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <label className="relative block min-w-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un invité, une idée, un thème..." className="box-border h-11 w-full min-w-0 border border-stone-800 bg-stone-900 pl-10 pr-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-300" />
          </label>
          <div className="mt-4 grid gap-4">
            <FilterRail label="Thèmes" items={themes.map((item) => ({ value: item, label: themeLabels[item] ?? item }))} value={theme} onChange={setTheme} />
            <FilterRail label="Années" items={years.map((item) => ({ value: item, label: item }))} value={year} onChange={setYear} />
          </div>
          {(theme !== "all" || year !== "all" || query) && (
            <button onClick={() => { setTheme("all"); setYear("all"); setQuery(""); }} className="mt-4 inline-flex w-fit items-center gap-2 border border-stone-700 px-3 py-2 text-sm text-stone-300 hover:border-amber-300 hover:text-amber-100">
              <X className="h-4 w-4" /> Réinitialiser les filtres
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold text-stone-50">{formatNumber(filtered.length)} interviews affichées</h2>
          <p className="text-sm text-stone-400">Tri par disponibilité éditoriale et publication dans le portail.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((interview) => (
            <Link href={`/interviews/${interview.slug}`} key={interview.id} className="group grid gap-4 border border-stone-800 bg-stone-950 p-4 transition hover:border-amber-300/60 hover:bg-stone-900 sm:grid-cols-[180px_1fr]">
              <Image src={interview.thumbnail} alt="" width={336} height={188} unoptimized className="aspect-video w-full object-cover" />
              <article className="min-w-0">
                <div className="flex flex-wrap gap-2">{interview.themes.slice(0, 3).map((item) => <span className="border border-teal-300/20 bg-teal-200/10 px-2 py-1 text-xs text-teal-100" key={item}>{themeLabels[item] ?? item}</span>)}</div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-stone-50">{interview.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-400">
                  <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{interview.guest}</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{interview.publish_date ?? "Date à préciser"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{interview.duration}</span>
                  <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{formatNumber(interview.transcript.words)} mots</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />{percent(interview.confidence)}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-300">{interview.executive_summary}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-amber-200">Ouvrir la synthèse <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function FilterRail({ label, items, value, onChange }: { label: string; items: { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <div className="flex min-w-0 flex-wrap gap-2">
        <button onClick={() => onChange("all")} className={`whitespace-nowrap border px-3 py-2 text-sm transition ${value === "all" ? "border-amber-300 bg-amber-200 text-stone-950" : "border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600"}`}>Tous</button>
        {items.map((item) => (
          <button key={item.value} onClick={() => onChange(item.value)} className={`whitespace-nowrap border px-3 py-2 text-sm transition ${value === item.value ? "border-amber-300 bg-amber-200 text-stone-950" : "border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600"}`}>{item.label}</button>
        ))}
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="border border-stone-800 bg-stone-900 p-4"><p className="text-2xl font-semibold text-stone-50">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">{label}</p></div>;
}
