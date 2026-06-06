import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenText, FileText, MessageSquareQuote } from "lucide-react";
import rawData from "@/data/interviews.json";
import { publishedPortalData } from "@/lib/published-interviews";
import { corpusMetrics } from "@/lib/analysis";
import type { PortalData } from "@/types/portal";

export default function Page() {
  const data = publishedPortalData(rawData as PortalData);
  const metrics = corpusMetrics(data.interviews);
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#0f0f0d,#151814_52%,#0b1718)] text-stone-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 md:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-amber-200/50 bg-amber-200 text-sm font-black text-stone-950">T</div>
            <div>
              <p className="text-lg font-semibold tracking-[0.08em]">THINKERVIEW</p>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Corpus Portal</p>
            </div>
          </div>
          <Link href="/resumes" className="hidden border border-white/15 px-4 py-2 text-sm text-stone-200 hover:border-amber-300 hover:text-amber-100 sm:inline-flex">Catalogue</Link>
        </header>
        <div className="grid flex-1 content-center gap-12 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Archive éditoriale premium</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] md:text-7xl">Comprendre les interviews Thinkerview dans la durée.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">Un portail de synthèses longues et d’analyses transversales construit à partir des transcripts disponibles, pour retrouver les idées, les recommandations et les évolutions du corpus.</p>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric value={metrics.interviews.toString()} label="interviews" />
              <Metric value={`${metrics.hours}h`} label="corpus" />
              <Metric value={metrics.transcripts.toString()} label="transcripts" />
              <Metric value={metrics.recommendations.toString()} label="lectures" />
            </div>
          </div>
          <div className="grid gap-4">
            <HomeCard href="/resumes" icon={<FileText className="h-6 w-6" />} title="Résumé des interviews" description="Catalogue complet des pages éditoriales, avec filtres par thème, année et recherche libre." />
            <HomeCard href="/analyse" icon={<BarChart3 className="h-6 w-6" />} title="Analyse du corpus" description="Conseils aux jeunes générations, recommandations de lecture, graphiques d’évolution et synthèse à venir." />
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeCard({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link href={href} className="group border border-white/12 bg-white/[0.06] p-6 transition hover:border-amber-300/70 hover:bg-white/[0.09]"><div className="text-amber-200">{icon}</div><h2 className="mt-5 text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-stone-300">{description}</p><p className="mt-6 inline-flex items-center gap-2 text-sm text-amber-200">Entrer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p></Link>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="border border-white/12 bg-white/[0.06] p-3"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-400">{label}</p></div>;
}
