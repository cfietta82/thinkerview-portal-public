import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  causalChains,
  corpusOverview,
  corpusTensions,
  majorWarnings,
  openQuestions,
  recurringFindings,
  reconstructionLevers,
  synthesisIdeas,
  thoughtBlocks,
} from "@/lib/corpus-analysis";

export default function SynthesePage() {
  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      <section className="border-b border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/analyse" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" /> Analyse
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Synthèse globale</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Ce que le corpus Thinkerview dit de la France, de l'Europe et du retour du réel
          </h1>
          <p className="mt-7 max-w-4xl text-lg leading-8 text-stone-300">{corpusOverview.thesis}</p>
          <p className="mt-7 max-w-3xl border-l border-amber-300/60 pl-5 text-2xl font-semibold leading-9 text-amber-100">
            {corpusOverview.shortThesis}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {causalChains.map((chain) => (
            <article key={chain.title} className="border border-stone-800 bg-[#11100e] p-5">
              <h2 className="text-lg font-semibold text-white">{chain.title}</h2>
              <div className="mt-5 space-y-2">
                {chain.steps.map((step, index) => (
                  <div key={step} className="flex gap-3 text-sm leading-6 text-stone-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-amber-300 text-xs font-bold text-black">{index + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Dix idées structurantes</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {synthesisIdeas.map((idea, index) => (
            <article key={idea.title} className="grid grid-cols-[48px_1fr] gap-4 border border-stone-800 bg-black/20 p-5">
              <div className="flex h-10 w-10 items-center justify-center bg-amber-300 text-sm font-bold text-black">{index + 1}</div>
              <div>
                <h2 className="text-xl font-semibold text-white">{idea.title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-300">{idea.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Blocs de pensée</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {thoughtBlocks.map((block) => (
            <article key={block.title} className="border border-stone-800 bg-[#11100e] p-5">
              <h2 className="text-lg font-semibold text-white">{block.title}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-2">
        <ListPanel title="Constats récurrents" items={recurringFindings} />
        <ListPanel title="Avertissements majeurs" items={majorWarnings} />
        <ListPanel title="Leviers de reconstruction" items={reconstructionLevers} />
        <ListPanel title="Questions ouvertes" items={openQuestions} />
      </section>

      <section className="border-t border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Tensions internes au corpus</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {corpusTensions.map((tension) => (
              <div key={tension} className="border border-stone-800 bg-black/20 p-4 text-sm leading-6 text-stone-300">
                {tension}
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-5xl text-xl font-semibold leading-9 text-white">
            La conclusion n'est pas un programme partisan, mais une exigence de méthode : accepter le coût du réel, retrouver des capacités concrètes, débattre des arbitrages et reconstruire les conditions matérielles d'une liberté politique.
          </p>
        </div>
      </section>
    </main>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border border-stone-800 bg-[#11100e] p-6">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <div key={item} className="grid grid-cols-[34px_1fr] gap-4 text-sm leading-7 text-stone-300">
            <span className="flex h-8 w-8 items-center justify-center border border-stone-700 text-xs font-semibold text-amber-200">{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
