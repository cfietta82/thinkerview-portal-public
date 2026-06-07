import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenText, Cloud, FileText } from "lucide-react";
import { corpusOverview, corpusEvidence } from "@/lib/corpus-analysis";

const cards = [
  {
    href: "/analyse/conseils",
    title: "Conseils aux jeunes générations",
    text: "Nuage de mots éditorialisé et axes pratiques récurrents dans les entretiens.",
    icon: Cloud,
  },
  {
    href: "/analyse/recommandations",
    title: "Bibliothèque recommandée",
    text: "Livres, rapports, médias, essais et sources primaires cités par les invités.",
    icon: BookOpenText,
  },
  {
    href: "/analyse/evolution",
    title: "Évolution du corpus",
    text: "Lecture temporelle des thèmes, orientations indicatives et dominantes annuelles.",
    icon: BarChart3,
  },
  {
    href: "/analyse/synthese",
    title: "Synthèse globale",
    text: "Idées structurantes, tensions, avertissements et leviers de reconstruction.",
    icon: FileText,
  },
];

const metrics = [
  { value: corpusOverview.interviews, label: "interviews" },
  { value: corpusOverview.hours, label: "heures" },
  { value: corpusOverview.guests, label: "invités" },
  { value: corpusOverview.recommendations, label: "références" },
];

export default function AnalysePage() {
  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      <section className="border-b border-stone-800 bg-[#12100d]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Thinkerview corpus
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                Analyse transversale des {corpusOverview.interviews} entretiens
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
                {corpusOverview.thesis}
              </p>
              <p className="mt-6 max-w-2xl border-l border-amber-300/60 pl-5 text-xl font-semibold leading-8 text-amber-100">
                {corpusOverview.shortThesis}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="border border-stone-700 bg-black/25 p-5">
                  <div className="text-3xl font-semibold text-white">{metric.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex min-h-[230px] flex-col justify-between border border-stone-800 bg-[#11100e] p-6 transition hover:border-amber-300/70 hover:bg-[#17140f]"
            >
              <div>
                <Icon className="h-7 w-7 text-amber-300" strokeWidth={1.7} />
                <h2 className="mt-6 text-2xl font-semibold text-white">{card.title}</h2>
                <p className="mt-4 text-sm leading-6 text-stone-400">{card.text}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-200">
                Ouvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {corpusEvidence.map((item) => (
            <article key={item.label} className="border border-stone-800 bg-black/20 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">{item.label}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
