import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import rawData from "@/data/interviews.json";
import { publishedPortalData } from "@/lib/published-interviews";
import { readingRecommendations } from "@/lib/analysis";
import { corpusOverview, readingTypeNotes } from "@/lib/corpus-analysis";
import { RecommendationsBrowser } from "@/components/recommendations-browser";
import type { PortalData } from "@/types/portal";

export default function RecommandationsPage() {
  const data = publishedPortalData(rawData as PortalData);
  const items = readingRecommendations(data.interviews);

  const typeCounts = readingTypeNotes.map((type) => ({
    ...type,
    count: items.filter((item) => item.type === type.type).length,
  }));

  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      <section className="border-b border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/analyse" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" /> Analyse
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Bibliothèque du corpus</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                {corpusOverview.recommendations} références pour travailler les entretiens
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
                Les recommandations ne forment pas un palmarès culturel. Elles dessinent une méthode : lire long, vérifier les sources, revenir aux rapports et tenir ensemble histoire, technique, économie et puissance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-stone-700 bg-black/25 p-5">
                <div className="text-3xl font-semibold text-white">{items.length}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">références indexées</div>
              </div>
              <div className="border border-stone-700 bg-black/25 p-5">
                <div className="text-3xl font-semibold text-white">{readingTypeNotes.length}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">familles de sources</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {typeCounts.map((type) => (
            <article key={type.type} className="border border-stone-800 bg-[#11100e] p-5">
              <div className="text-2xl font-semibold text-amber-200">{type.count}</div>
              <h2 className="mt-3 text-lg font-semibold text-white">{type.type}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-400">{type.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <RecommendationsBrowser items={items} />
      </section>
    </main>
  );
}
