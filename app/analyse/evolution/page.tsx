import Link from "next/link";
import type { ReactNode } from "react";
import rawData from "@/data/interviews.json";
import {
  corpusMetrics,
  orientationColors,
  orientationDistribution,
  orientationLabels,
  themeLabels,
  themesByOrientation,
  topThemes,
  yearlyCorpusRows
} from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

const orientationNotes: Record<string, string> = {
  gauche: "Justice sociale, services publics, écologie politique, critique des inégalités.",
  centre: "Institutions, régulation, modernisation, politiques publiques et arbitrages économiques.",
  droite: "Souveraineté, sécurité, frontières, ordre public, critique de la technocratie européenne.",
  "non politique": "Entretiens surtout techniques, scientifiques, culturels ou méthodologiques.",
  "non renseigné": "Données encore insuffisantes pour produire une lecture honnête."
};

export default function EvolutionPage() {
  const interviews = publishedPortalData(rawData as PortalData).interviews;
  const metrics = corpusMetrics(interviews);
  const distribution = orientationDistribution(interviews);
  const politicalTotal = distribution.filter((item) => item.label !== "non politique" && item.label !== "non renseigné").reduce((acc, item) => acc + item.count, 0);
  const rows = yearlyCorpusRows(interviews);
  const maxYear = Math.max(...rows.map((row) => row.total), 1);
  const themeTotals = topThemes(interviews).slice(0, 10);
  const matrix = themesByOrientation(interviews);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-stone-800 bg-[radial-gradient(circle_at_top_left,rgba(253,224,71,0.13),transparent_34%),#0c0a09]">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link>
          <div className="mt-5 grid gap-8 xl:grid-cols-[1fr_520px]">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-stone-50 md:text-5xl">Évolution éditoriale du corpus</h1>
              <p className="mt-4 max-w-4xl text-base leading-7 text-stone-300">Cette page lit le corpus comme une trajectoire : volume d’entretiens, sujets dominants par année et positionnement politique indicatif déduit des thèmes, rôles, résumés et angles développés dans les pages.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric value={metrics.interviews.toString()} label="interviews" />
              <Metric value={`${metrics.hours} h`} label="corpus vidéo" />
              <Metric value={metrics.guests.toString()} label="invités distincts" />
              <Metric value={rows.length.toString()} label="années suivies" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Lecture politique indicative">
            <div className="grid gap-3 md:grid-cols-3">
              {distribution.filter((item) => ["gauche", "centre", "droite"].includes(item.label)).map((item) => (
                <div key={item.label} className="border border-stone-800 bg-stone-900 p-4">
                  <div className={`mb-4 h-1.5 w-16 ${orientationColors[item.label]}`} />
                  <p className="text-3xl font-semibold text-stone-50">{item.count}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{orientationLabels[item.label]}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{orientationNotes[item.label]}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {distribution.filter((item) => !["gauche", "centre", "droite"].includes(item.label)).map((item) => (
                <div key={item.label} className="flex items-center justify-between border border-stone-800 bg-stone-950 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-200">{orientationLabels[item.label]}</p>
                    <p className="mt-1 text-xs text-stone-500">{orientationNotes[item.label]}</p>
                  </div>
                  <p className="text-2xl font-semibold text-stone-50">{item.count}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-400">{politicalTotal} entretiens portent une orientation éditoriale lisible. Ce n’est pas une étiquette personnelle définitive : c’est une lecture du contenu publié dans le portail.</p>
          </Panel>

          <Panel title="Dominantes thématiques">
            <div className="space-y-3">
              {themeTotals.map(([theme, value]) => (
                <ThemeBar key={theme} label={themeLabels[theme] ?? theme} value={value} max={themeTotals[0]?.[1] ?? 1} />
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Trajectoire annuelle" className="mt-6">
          <div className="mb-5 flex flex-wrap gap-3 text-xs text-stone-400">
            {["gauche", "centre", "droite", "non politique", "non renseigné"].map((label) => (
              <span key={label} className="inline-flex items-center gap-2"><span className={`h-2.5 w-2.5 ${orientationColors[label]}`} />{orientationLabels[label]}</span>
            ))}
          </div>
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.year} className="grid gap-3 border-t border-stone-900 pt-4 md:grid-cols-[72px_1fr_280px] md:items-center">
                <div>
                  <p className="font-mono text-base text-stone-200">{row.year}</p>
                  <p className="text-xs text-stone-500">{row.total} pages</p>
                </div>
                <div>
                  <div className="h-8 bg-stone-900" style={{ width: `${Math.max(14, (row.total / maxYear) * 100)}%` }}>
                    <div className="flex h-full overflow-hidden">
                      {row.orientations.map((item) => (
                        <span key={item.label} title={`${orientationLabels[item.label]}: ${item.count}`} className={orientationColors[item.label]} style={{ width: row.total ? `${(item.count / row.total) * 100}%` : "0%" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.themes.slice(0, 3).map(([theme, value]) => (
                    <span key={theme} className="border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs text-stone-300">{themeLabels[theme] ?? theme} {value}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Thèmes associés aux orientations" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-4">
            {matrix.map((item) => (
              <div key={item.label} className="border border-stone-800 bg-stone-900 p-4">
                <div className={`mb-4 h-1.5 w-14 ${orientationColors[item.label]}`} />
                <h2 className="text-lg font-semibold text-stone-50">{orientationLabels[item.label]}</h2>
                <div className="mt-4 space-y-3">
                  {item.themes.map(([theme, value]) => (
                    <div key={theme} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-stone-300">{themeLabels[theme] ?? theme}</span>
                      <span className="font-mono text-stone-500">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`border border-stone-800 bg-stone-950 p-5 ${className}`}><h2 className="text-2xl font-semibold text-stone-50">{title}</h2><div className="mt-5">{children}</div></section>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="border border-stone-800 bg-stone-900 p-4"><p className="text-2xl font-semibold text-stone-50">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">{label}</p></div>;
}

function ThemeBar({ label, value, max }: { label: string; value: number; max: number }) {
  return <div className="grid grid-cols-[128px_1fr_44px] items-center gap-3 text-sm"><span className="truncate text-stone-300">{label}</span><span className="h-3 bg-stone-900"><span className="block h-3 bg-amber-300" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} /></span><span className="text-right font-mono text-stone-500">{value}</span></div>;
}
