import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import rawData from "@/data/interviews.json";
import { publishedPortalData } from "@/lib/published-interviews";
import {
  corpusMetrics,
  orientationColors,
  orientationDistribution,
  orientationEvolution,
  orientationLabels,
  themeEvolution,
  themeLabels,
  yearlyCorpusRows,
} from "@/lib/analysis";
import { annualDominantes, thematicHierarchy } from "@/lib/corpus-analysis";
import type { PortalData } from "@/types/portal";

export default function EvolutionPage() {
  const data = publishedPortalData(rawData as PortalData);
  const interviews = data.interviews;
  const metrics = corpusMetrics(interviews);
  const yearlyRows = yearlyCorpusRows(interviews);
  const maxYearCount = Math.max(...yearlyRows.map((row) => row.total));
  const orientations = orientationDistribution(interviews);
  const orientationRows = orientationEvolution(interviews);
  const themeRows = themeEvolution(interviews);

  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      <section className="border-b border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/analyse" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" /> Analyse
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Évolution du corpus</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Quatorze ans de déplacement des priorités
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
                La trajectoire du corpus fait apparaître une montée continue des sujets de puissance : géopolitique, énergie, numérique, sécurité, économie productive et crise démocratique.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric value={metrics.interviews} label="interviews" />
              <Metric value={metrics.hours} label="heures de vidéo" />
              <Metric value={metrics.guests} label="invités différents" />
              <Metric value={yearlyRows.length} label="années couvertes" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="border border-stone-800 bg-[#11100e] p-6">
          <h2 className="text-2xl font-semibold text-white">Hiérarchie thématique</h2>
          <div className="mt-6 space-y-4">
            {thematicHierarchy.map((item) => (
              <div key={item.theme}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-stone-100">{item.theme}</span>
                  <span className="text-stone-500">{item.count} · {item.share}%</span>
                </div>
                <div className="h-2 bg-stone-900">
                  <div className="h-2 bg-amber-300" style={{ width: item.share + "%" }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-500">{item.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-stone-800 bg-[#11100e] p-6">
          <h2 className="text-2xl font-semibold text-white">Dominantes annuelles</h2>
          <div className="mt-6 space-y-4">
            {annualDominantes.map((row) => (
              <div key={row.year} className="grid gap-4 border-b border-stone-800 pb-4 last:border-b-0 md:grid-cols-[70px_1fr]">
                <div>
                  <div className="text-xl font-semibold text-amber-200">{row.year}</div>
                  <div className="text-xs text-stone-500">{row.interviews} entretiens</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{row.dominant}</div>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{row.reading}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <article className="border border-stone-800 bg-black/20 p-6">
          <h2 className="text-2xl font-semibold text-white">Volume annuel</h2>
          <div className="mt-6 space-y-3">
            {yearlyRows.map((row) => (
              <div key={row.year} className="grid grid-cols-[58px_1fr_42px] items-center gap-4">
                <span className="text-sm text-stone-400">{row.year}</span>
                <div className="h-5 bg-stone-900">
                  <div className="h-5 bg-gradient-to-r from-amber-300 via-cyan-300 to-lime-300" style={{ width: (row.total / maxYearCount) * 100 + "%" }} />
                </div>
                <span className="text-right text-sm text-stone-400">{row.total}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="border border-stone-800 bg-[#11100e] p-6">
          <h2 className="text-2xl font-semibold text-white">Orientation politique indicative</h2>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            Catégorisation éditoriale par positionnement public, thèmes défendus et grammaire politique dominante, pas seulement par appartenance partisane.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {orientations.map((item) => (
              <div key={item.label} className="border border-stone-800 bg-black/20 p-4">
                <div className="text-3xl font-semibold text-white">{item.count}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">{orientationLabels[item.label]}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-stone-800 bg-[#11100e] p-6">
          <h2 className="text-2xl font-semibold text-white">Orientations par année</h2>
          <div className="mt-6 space-y-4">
            {orientationRows.rows.map((row) => {
              const total = row.values.reduce((sum, value) => sum + value, 0);
              return (
                <div key={row.year}>
                  <div className="mb-2 flex justify-between text-sm text-stone-400">
                    <span>{row.year}</span>
                    <span>{total}</span>
                  </div>
                  <div className="flex h-5 overflow-hidden bg-stone-900">
                    {orientationRows.labels.map((label, index) => {
                      const count = row.values[index] ?? 0;
                      return count > 0 ? (
                        <div
                          key={label}
                          title={orientationLabels[label] + " " + count}
                          className={orientationColors[label]}
                          style={{ width: (count / total) * 100 + "%" }}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <article className="border border-stone-800 bg-[#11100e] p-6">
          <h2 className="text-2xl font-semibold text-white">Thématiques par année</h2>
          <div className="mt-6 space-y-6">
            {themeRows.rows.map((row) => {
              const entries = row.values
                .map((value, index) => ({ theme: themeRows.themes[index], value }))
                .filter((entry) => entry.value > 0)
                .sort((a, b) => b.value - a.value);
              const total = entries.reduce((sum, entry) => sum + entry.value, 0);
              return (
                <div key={row.year} className="grid gap-3 md:grid-cols-[70px_1fr]">
                  <div className="text-sm font-semibold text-stone-300">{row.year}</div>
                  <div>
                    <div className="flex h-6 overflow-hidden bg-stone-900">
                      {entries.map((entry, index) => (
                        <div
                          key={entry.theme}
                          title={(themeLabels[entry.theme] ?? entry.theme) + " " + entry.value}
                          style={{
                            width: (entry.value / total) * 100 + "%",
                            background: ["#facc15", "#67e8f9", "#a3e635", "#f9a8d4", "#c4b5fd", "#fdba74", "#5eead4", "#93c5fd"][index % 8],
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                      {entries.slice(0, 8).map((entry) => (
                        <span key={entry.theme}>{themeLabels[entry.theme] ?? entry.theme} {entry.value}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="border border-stone-700 bg-black/25 p-5">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">{label}</div>
    </div>
  );
}
