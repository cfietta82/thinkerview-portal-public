import Link from "next/link";
import rawData from "@/data/interviews.json";
import { orientationEvolution, orientationLabels, themeEvolution, themeLabels, topThemes } from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function EvolutionPage() {
  const interviews = publishedPortalData(rawData as PortalData).interviews;
  const themes = themeEvolution(interviews);
  const orientations = orientationEvolution(interviews);
  const themeTotals = topThemes(interviews).slice(0, 12);
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link>
        <h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">Évolution du corpus</h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-stone-300">Les thèmes ont été recalculés à partir des titres, rôles, résumés et sections. L’orientation politique reste indicative : elle classe les responsables ou commentateurs politiques identifiables, et laisse le reste en non politique ou non renseigné.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Répartition thématique">
            <div className="space-y-3">{themeTotals.map(([theme, value]) => <Bar key={theme} label={themeLabels[theme] ?? theme} value={value} max={themeTotals[0]?.[1] ?? 1} />)}</div>
          </Panel>
          <Panel title="Orientation politique indicative">
            <div className="grid gap-3 sm:grid-cols-5">{orientations.labels.map((label, index) => {
              const total = orientations.rows.reduce((acc, row) => acc + row.values[index], 0);
              return <div key={label} className="border border-stone-800 bg-stone-900 p-4"><p className="text-2xl font-semibold text-stone-50">{total}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">{orientationLabels[label]}</p></div>;
            })}</div>
          </Panel>
        </div>
        <Timeline title="Thématiques par année" labels={themes.themes.map((theme) => themeLabels[theme] ?? theme)} rows={themes.rows} />
        <Timeline title="Orientation par année" labels={orientations.labels.map((label) => orientationLabels[label])} rows={orientations.rows} />
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <div className="border border-stone-800 bg-stone-950 p-5"><h2 className="text-2xl font-semibold text-stone-50">{title}</h2><div className="mt-5">{children}</div></div>; }
function Bar({ label, value, max }: { label: string; value: number; max: number }) { return <div className="grid grid-cols-[150px_1fr_44px] items-center gap-3 text-sm"><span className="truncate text-stone-300">{label}</span><span className="h-3 bg-stone-900"><span className="block h-3 bg-amber-300" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} /></span><span className="text-right font-mono text-stone-500">{value}</span></div>; }
function Timeline({ title, labels, rows }: { title: string; labels: string[]; rows: { year: string; values: number[] }[] }) {
  const max = Math.max(...rows.map((row) => row.values.reduce((a, b) => a + b, 0)), 1);
  return <div className="mt-8 border border-stone-800 bg-stone-950 p-5"><h2 className="text-2xl font-semibold text-stone-50">{title}</h2><div className="mt-6 space-y-5">{rows.map((row) => { const total = row.values.reduce((a, b) => a + b, 0); return <div key={row.year} className="grid gap-2 md:grid-cols-[72px_1fr]"><p className="font-mono text-sm text-stone-400">{row.year}</p><div><div className="flex h-6 overflow-hidden bg-stone-900" style={{ width: `${Math.max(12, (total / max) * 100)}%` }}>{row.values.map((value, index) => <span key={labels[index]} title={`${labels[index]}: ${value}`} className={palette(index)} style={{ width: total ? `${(value / total) * 100}%` : "0%" }} />)}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">{row.values.map((value, index) => value > 0 ? <span key={labels[index]}>{labels[index]} {value}</span> : null)}</div></div></div>; })}</div></div>;
}
function palette(index: number) { return ["bg-amber-300","bg-teal-300","bg-sky-300","bg-rose-300","bg-lime-300","bg-violet-300","bg-orange-300","bg-cyan-300","bg-fuchsia-300","bg-emerald-300"][index % 10]; }
