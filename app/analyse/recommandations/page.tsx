import Link from "next/link";
import rawData from "@/data/interviews.json";
import { readingRecommendations } from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function RecommendationsPage() {
  const items = readingRecommendations(publishedPortalData(rawData as PortalData).interviews);
  return <main className="min-h-screen bg-background"><section className="mx-auto max-w-7xl px-5 py-10 md:px-8"><Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link><h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">Recommandations de lecture</h1><p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Liste consolidée des livres, rapports, auteurs, ressources et sources conseillés ou directement suggérés par les synthèses.</p><div className="mt-8 grid gap-3">{items.map((item, index) => <Link href={`/interviews/${item.slug}`} key={`${item.slug}-${index}`} className="border border-stone-800 bg-stone-950 p-4 hover:border-amber-300/60"><p className="text-lg font-semibold text-stone-50">{item.recommendation}</p><p className="mt-2 text-sm text-stone-400">{item.guest} · {item.year} · {item.title}</p></Link>)}</div></section></main>;
}
