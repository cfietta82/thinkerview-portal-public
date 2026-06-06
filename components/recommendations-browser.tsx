"use client";

import Link from "next/link";
import { BookOpenText, Search, X } from "lucide-react";

type Recommendation = {
  recommendation: string;
  type: string;
  guest: string;
  title: string;
  slug: string;
  year: string;
  themes: string[];
};

export function RecommendationsBrowser({ items }: { items: Recommendation[] }) {
  const [type, setType] = React.useState("Tous");
  const [query, setQuery] = React.useState("");
  const types = React.useMemo(() => ["Tous", ...Array.from(new Set(items.map((item) => item.type))).sort()], [items]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => (type === "Tous" || item.type === type) && (!q || [item.recommendation, item.guest, item.title, item.year, item.type].join(" ").toLowerCase().includes(q)));
  }, [items, query, type]);

  return (
    <div className="mt-8">
      <div className="border border-stone-800 bg-stone-950 p-4">
        <label className="relative block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une lecture, un invité, une année..." className="h-10 w-full border border-stone-800 bg-stone-900 pl-10 pr-3 text-sm text-stone-100 outline-none focus:border-amber-300" />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {types.map((item) => <button key={item} onClick={() => setType(item)} className={`whitespace-nowrap border px-3 py-2 text-sm ${type === item ? "border-amber-300 bg-amber-200 text-stone-950" : "border-stone-800 bg-stone-900 text-stone-300"}`}>{item}</button>)}
          {(type !== "Tous" || query) && <button onClick={() => { setType("Tous"); setQuery(""); }} className="inline-flex items-center gap-2 border border-stone-700 px-3 py-2 text-sm text-stone-300"><X className="h-4 w-4" />Reset</button>}
        </div>
      </div>
      <p className="mt-5 text-sm text-stone-400">{filtered.length} recommandations affichées sur {items.length}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((item, index) => <Link href={`/interviews/${item.slug}`} key={`${item.slug}-${index}`} className="group border border-stone-800 bg-stone-950 p-5 transition hover:border-amber-300/60 hover:bg-stone-900">
          <div className="flex items-start justify-between gap-4">
            <span className="border border-teal-300/20 bg-teal-200/10 px-2 py-1 text-xs text-teal-100">{item.type}</span>
            <BookOpenText className="h-5 w-5 shrink-0 text-amber-200" />
          </div>
          <p className="mt-4 text-lg font-semibold leading-7 text-stone-50">{item.recommendation}</p>
          <p className="mt-3 text-sm leading-6 text-stone-400">{item.guest} · {item.year}</p>
          <p className="mt-1 line-clamp-2 text-sm text-stone-500">{item.title}</p>
        </Link>)}
      </div>
    </div>
  );
}

import React from "react";
