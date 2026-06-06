import Link from "next/link";
import rawData from "@/data/interviews.json";
import { adviceWordCloud } from "@/lib/analysis";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function ConseilsPage() {
  const words = adviceWordCloud(publishedPortalData(rawData as PortalData).interviews);
  const max = Math.max(...words.map((item) => item.count), 1);
  return <main className="min-h-screen bg-background"><section className="mx-auto max-w-7xl px-5 py-10 md:px-8"><Header title="Conseils aux jeunes générations" /><div className="mt-8 border border-stone-800 bg-stone-950 p-6"><div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">{words.map((item) => <span key={item.word} className="font-semibold text-amber-100" style={{ fontSize: `${14 + (item.count / max) * 34}px`, opacity: 0.58 + (item.count / max) * 0.42 }}>{item.word}</span>)}</div></div></section></main>;
}
function Header({ title }: { title: string }) { return <><Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link><h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Nuage construit à partir du champ éditorial “conseils aux jeunes générations” des pages publiées.</p></>; }
