import Link from "next/link";
import rawData from "@/data/interviews.json";
import { RecommendationsBrowser } from "@/components/recommendations-browser";
import { readingRecommendations } from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function RecommendationsPage() {
  const items = readingRecommendations(publishedPortalData(rawData as PortalData).interviews);
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold text-stone-50 md:text-5xl">Bibliothèque recommandée</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Toutes les références extraites des pages éditoriales, classées par type pour distinguer livres, rapports, travaux de recherche et médias.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric value={items.length.toString()} label="références" />
            <Metric value={new Set(items.map((item) => item.type)).size.toString()} label="types" />
          </div>
        </div>
        <RecommendationsBrowser items={items} />
      </section>
    </main>
  );
}
function Metric({ value, label }: { value: string; label: string }) { return <div className="border border-stone-800 bg-stone-950 p-4"><p className="text-2xl font-semibold text-stone-50">{value}</p><p className="text-xs uppercase tracking-[0.14em] text-stone-500">{label}</p></div>; }
