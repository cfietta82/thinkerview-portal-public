import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { VideoPosterEmbed } from "@/components/video-poster-embed";
import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Library,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import rawData from "@/data/interviews.json";
import { publishedInterviews } from "@/lib/published-interviews";
import { orientationLabels, themeLabels } from "@/lib/analysis";
import type { Interview, PortalData } from "@/types/portal";

const data = rawData as PortalData;
const interviews = publishedInterviews(data);

export function generateStaticParams() {
  return interviews.map((interview) => ({ slug: interview.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const interview = findInterview(slug);
  if (!interview) return {};

  return {
    title: `${interview.guest} · Thinkerview Portal`,
    description: interview.executive_summary
  };
}

export default async function InterviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const interview = findInterview(slug);
  if (!interview) notFound();

  return (
    <main>
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,#111111,#17120d_46%,#0f1715)]">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <Link href="/resumes" className="inline-flex items-center gap-2 text-sm text-stone-300 transition hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" />
            Retour aux résumés
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border border-white/12 bg-white/[0.06] p-3">
              <VideoPosterEmbed id={interview.id} title={interview.title} />
              <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-stone-300">
                <PremiumFact icon={Clock3} label="Durée" value={interview.duration} />
                <PremiumFact icon={CalendarDays} label="Date" value={interview.publish_date ?? "Date à préciser"} />
                <PremiumFact icon={FileText} label="Transcript" value={`${formatNumber(interview.transcript.words)} mots`} />
                <PremiumFact icon={ShieldCheck} label="Confiance" value={`${Math.round(interview.confidence * 100)}%`} />
                <PremiumFact icon={BookOpenText} label="Sections" value={interview.sections.length.toString()} />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 border border-amber-200/30 bg-amber-100/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
                <Sparkles className="h-3.5 w-3.5" />
                Cartouche premium
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-50 md:text-5xl">{interview.guest}</h1>
              <p className="mt-3 text-lg leading-7 text-stone-200">{interview.title}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {interview.themes.map((theme) => (
                  <span className="border border-teal-300/20 bg-teal-200/10 px-3 py-1 text-sm text-teal-100" key={theme}>
                    {themeLabels[theme] ?? theme}
                  </span>
                ))}
              </div>

              {interview.political_orientation && (
                <div className="mt-4 inline-flex border border-stone-700 bg-black/20 px-3 py-2 text-sm text-stone-200">
                  Orientation politique indicative : <span className="ml-2 text-amber-100">{orientationLabels[interview.political_orientation] ?? interview.political_orientation}</span>
                </div>
              )}

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <CartoucheBlock icon={GraduationCap} label="Conseil aux jeunes générations">
                  <p>{interview.youth_advice ?? "Conseil à compléter lors de la prochaine passe éditoriale."}</p>
                </CartoucheBlock>
                <CartoucheBlock icon={Library} label="Recommandations de lecture">
                  {interview.reading_recommendations?.length ? (
                    <ul className="space-y-1.5">
                      {interview.reading_recommendations.map((recommendation) => (
                        <li key={recommendation}>{recommendation}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Recommandations à compléter lors de la prochaine passe éditoriale.</p>
                  )}
                </CartoucheBlock>
              </div>

              <div className="mt-6 border-l border-amber-200/40 pl-5">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-100">Résumé exécutif</p>
                <KeyIdeas points={interview.executive_points} summary={interview.executive_summary ?? ""} />
              </div>

              <a
                href={interview.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-stone-700 px-4 py-2 text-sm text-stone-100 transition hover:border-amber-300 hover:text-amber-100"
              >
                Voir la source YouTube
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border border-stone-800 bg-stone-950 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Navigation</p>
            <nav className="mt-4 grid gap-2">
              {interview.sections.map((section, index) => (
                <a href={`#section-${index + 1}`} className="text-sm leading-5 text-stone-300 transition hover:text-amber-200" key={section.title}>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="space-y-5">
          <div className="border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Note méthodologique</p>
            <p className="mt-2 text-sm leading-6 text-stone-300">{interview.method_note}</p>
          </div>

          {interview.sections.map((section, index) => (
            <section id={`section-${index + 1}`} className="scroll-mt-8 border border-stone-800 bg-stone-950 p-5 md:p-7" key={section.title}>
              <h2 className="text-2xl font-semibold text-stone-50">{section.title}</h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-stone-200">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}

function findInterview(slug: string): Interview | undefined {
  return interviews.find((interview) => interview.slug === slug);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function KeyIdeas({ points, summary }: { points?: string[]; summary: string }) {
  const normalizedPoints = points?.length ? points.map((text, index) => ({ index: String(index + 1), text })) : undefined;
  if (normalizedPoints?.length) {
    return <ExecutiveList ideas={normalizedPoints} />;
  }
  const ideas = parseKeyIdeas(summary);

  if (ideas.length >= 5) {
    return <ExecutiveList ideas={ideas} />;
  }

  return <p className="mt-3 whitespace-pre-line text-base leading-8 text-stone-200">{summary}</p>;
}

function ExecutiveList({ ideas }: { ideas: { index: string; text: string }[] }) {
  return (
    <ol className="mt-5 grid gap-4">
      {ideas.slice(0, 10).map((idea) => (
        <li className="grid grid-cols-[2.25rem_1fr] gap-3 text-base font-semibold leading-7 text-stone-200" key={`${idea.index}-${idea.text}`}>
          <span className="flex h-8 w-8 items-center justify-center bg-amber-100/10 text-sm font-semibold text-amber-100">{idea.index}</span>
          <span>{idea.text}</span>
        </li>
      ))}
    </ol>
  );
}

function parseKeyIdeas(summary: string) {
  return summary
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.match(/^(\d{1,2})[.)]\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({ index: match[1], text: match[2] }));
}

function CartoucheBlock({
  icon: Icon,
  label,
  children
}: {
  icon: typeof Clock3;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-white/12 bg-black/20 p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-amber-100">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <div className="mt-3 text-sm leading-6 text-stone-200">{children}</div>
    </div>
  );
}

function PremiumFact({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/12 bg-black/20 p-3">
      <p className="flex items-center gap-1.5 text-stone-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 font-medium text-stone-50">{value}</p>
    </div>
  );
}
