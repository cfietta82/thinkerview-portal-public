import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenText, Cloud, FileText } from "lucide-react";
import rawData from "@/data/interviews.json";
import { publishedPortalData } from "@/lib/published-interviews";
import { corpusMetrics } from "@/lib/analysis";
import type { PortalData } from "@/types/portal";

const links = [
  { href: "/analyse/conseils", title: "Nuage de conseils", description: "Les mots forts issus des conseils aux jeunes générations.", icon: Cloud },
  { href: "/analyse/recommandations", title: "Recommandations de lecture", description: "Toutes les lectures, auteurs et sources conseillées par les invités.", icon: BookOpenText },
  { href: "/analyse/evolution", title: "Évolution du corpus", description: "Graphiques par années, thématiques et orientation politique indicative.", icon: BarChart3 },
  { href: "/analyse/synthese", title: "Synthèse globale", description: "Espace réservé à la synthèse des idées principales du corpus.", icon: FileText }
];

export default function AnalysePage() {
  const data = publishedPortalData(rawData as PortalData);
  const metrics = corpusMetrics(data.interviews);
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Link href="/" className="text-xs uppercase tracking-[0.24em] text-amber-200">Thinkerview Corpus</Link>
        <h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">Analyse du corpus</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">Un espace pour exploiter transversalement les synthèses : conseils, lectures recommandées, tendances temporelles et synthèse éditoriale à venir.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-4"><Metric value={metrics.interviews.toString()} label="interviews" /><Metric value={`${metrics.hours}h`} label="heures" /><Metric value={metrics.recommendations.toString()} label="lectures" /><Metric value={metrics.transcripts.toString()} label="transcripts" /></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {links.map(({ href, title, description, icon: Icon }) => <Link href={href} key={href} className="group border border-stone-800 bg-stone-950 p-6 hover:border-amber-300/70"><Icon className="h-6 w-6 text-amber-200" /><h2 className="mt-4 text-2xl font-semibold text-stone-50">{title}</h2><p className="mt-3 text-sm leading-6 text-stone-300">{description}</p><p className="mt-5 inline-flex items-center gap-2 text-sm text-amber-200">Ouvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p></Link>)}
        </div>
      </section>
    </main>
  );
}
function Metric({ value, label }: { value: string; label: string }) { return <div className="border border-stone-800 bg-stone-950 p-4"><p className="text-2xl font-semibold text-stone-50">{value}</p><p className="text-xs uppercase tracking-[0.14em] text-stone-500">{label}</p></div>; }
