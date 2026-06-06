import Link from "next/link";
import rawData from "@/data/interviews.json";
import { orientationEvolution, themeEvolution, themeLabels } from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function EvolutionPage() {
  const interviews = publishedPortalData(rawData as PortalData).interviews;
  const themes = themeEvolution(interviews);
  const orientations = orientationEvolution(interviews);
  return <main className="min-h-screen bg-background"><section className="mx-auto max-w-7xl px-5 py-10 md:px-8"><Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link><h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">Évolution du corpus</h1><p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Lecture temporelle des interviews publiées. L’orientation politique est indicative et déduite des métadonnées disponibles ; elle doit être remplacée par une classification éditoriale validée si le portail devient une base de référence.</p><Chart title="Thématiques par année" labels={themes.themes.map((theme) => themeLabels[theme] ?? theme)} rows={themes.rows} /><Chart title="Orientation politique indicative" labels={orientations.labels} rows={orientations.rows} /></section></main>;
}
function Chart({ title, labels, rows }: { title: string; labels: string[]; rows: { year: string; values: number[] }[] }) {
  const max = Math.max(...rows.flatMap((row) => row.values), 1);
  return <div className="mt-8 border border-stone-800 bg-stone-950 p-5"><h2 className="text-2xl font-semibold text-stone-50">{title}</h2><div className="mt-5 grid gap-5">{rows.map((row) => <div key={row.year} className="grid gap-2 md:grid-cols-[72px_1fr]"><p className="font-mono text-sm text-stone-400">{row.year}</p><div className="grid gap-2">{row.values.map((value, index) => <div key={labels[index]} className="grid grid-cols-[160px_1fr_40px] items-center gap-3 text-sm"><span className="truncate text-stone-400">{labels[index]}</span><span className="h-3 bg-stone-900"><span className="block h-3 bg-amber-300" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} /></span><span className="text-right font-mono text-stone-500">{value}</span></div>)}</div></div>)}</div></div>;
}
