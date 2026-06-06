import Link from "next/link";

export default function SynthesePage() {
  return <main className="min-h-screen bg-background"><section className="mx-auto max-w-5xl px-5 py-10 md:px-8"><Link href="/analyse" className="text-xs uppercase tracking-[0.24em] text-amber-200">Analyse</Link><div className="mt-10 border border-stone-800 bg-stone-950 p-8"><p className="text-xs uppercase tracking-[0.24em] text-stone-500">À compléter</p><h1 className="mt-5 text-4xl font-semibold text-stone-50 md:text-5xl">Synthèse des idées principales</h1><p className="mt-5 max-w-3xl text-base leading-7 text-stone-300">Cette page est volontairement laissée vide pour accueillir plus tard la synthèse éditoriale globale du corpus Thinkerview.</p></div></section></main>;
}
