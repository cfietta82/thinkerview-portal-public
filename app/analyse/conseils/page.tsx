import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { adviceAxes, adviceKeywords, corpusOverview } from "@/lib/corpus-analysis";

function sizeClass(weight: number) {
  if (weight >= 90) return "text-4xl md:text-6xl";
  if (weight >= 75) return "text-3xl md:text-5xl";
  if (weight >= 60) return "text-2xl md:text-4xl";
  return "text-xl md:text-3xl";
}

export default function ConseilsPage() {
  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      <section className="border-b border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/analyse" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" /> Analyse
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Conseils récurrents</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Ce que les invités transmettent aux générations suivantes
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
                Les conseils convergent moins vers une morale individuelle que vers une discipline de lucidité : apprendre, vérifier, produire, se former techniquement et défendre le commun.
              </p>
            </div>
            <div className="border border-amber-300/30 bg-black/25 p-6">
              <ShieldCheck className="h-7 w-7 text-amber-300" />
              <p className="mt-4 text-2xl font-semibold leading-9 text-amber-100">{corpusOverview.shortThesis}</p>
              <p className="mt-4 text-sm leading-7 text-stone-400">
                Le nuage ci-dessous est éditorialisé à partir des recommandations explicites, des formules récurrentes et des priorités pratiques identifiées dans l'analyse du corpus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="border border-stone-800 bg-[#11100e] p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 text-center">
            {adviceKeywords.map((item, index) => (
              <span
                key={item.word}
                className={[
                  "font-semibold leading-none",
                  sizeClass(item.weight),
                  index % 4 === 0 ? "text-amber-200" : index % 4 === 1 ? "text-stone-100" : index % 4 === 2 ? "text-cyan-200" : "text-lime-200",
                ].join(" ")}
                title={item.axis}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Doctrine pratique</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Huit réflexes de reconstruction</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adviceAxes.map((axis, index) => (
            <article key={axis.title} className="border border-stone-800 bg-black/20 p-5">
              <div className="mb-5 flex h-9 w-9 items-center justify-center bg-amber-300 text-sm font-bold text-black">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white">{axis.title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">{axis.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
