"use client";

import React from "react";
import { themeLabels } from "@/lib/analysis";

type Item = {
  recommendation: string;
  type: string;
  guest: string;
  title: string;
  slug: string;
  year: string;
  themes: string[];
};

export function RecommendationsBrowser({ items }: { items: Item[] }) {
  const [activeType, setActiveType] = React.useState("all");
  const [activeTheme, setActiveTheme] = React.useState("all");
  const [activeYear, setActiveYear] = React.useState("all");
  const [query, setQuery] = React.useState("");

  const types = React.useMemo(() => Array.from(new Set(items.map((item) => item.type))).sort(), [items]);
  const years = React.useMemo(() => Array.from(new Set(items.map((item) => item.year))).sort((a, b) => Number(b) - Number(a)), [items]);
  const themes = React.useMemo(() => Array.from(new Set(items.flatMap((item) => item.themes))).sort(), [items]);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = activeType === "all" || item.type === activeType;
      const matchesTheme = activeTheme === "all" || item.themes.includes(activeTheme);
      const matchesYear = activeYear === "all" || item.year === activeYear;
      const haystack = [item.recommendation, item.guest, item.title, item.year].join(" ").toLowerCase();
      return matchesType && matchesTheme && matchesYear && (!normalized || haystack.includes(normalized));
    });
  }, [activeType, activeTheme, activeYear, items, query]);

  return (
    <div className="space-y-8">
      <div className="border border-stone-800 bg-[#11100e] p-5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un auteur, un titre, une source ou un entretien..."
          className="w-full border border-stone-700 bg-black/30 px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-300"
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <FilterSelect label="Type" value={activeType} onChange={setActiveType} options={[["all", "Tous les types"], ...types.map((type) => [type, type] as [string, string])]} />
          <FilterSelect label="Thème" value={activeTheme} onChange={setActiveTheme} options={[["all", "Tous les thèmes"], ...themes.map((theme) => [theme, themeLabels[theme] ?? theme] as [string, string])]} />
          <FilterSelect label="Année" value={activeYear} onChange={setActiveYear} options={[["all", "Toutes les années"], ...years.map((year) => [year, year] as [string, string])]} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">{filtered.length} recommandations affichées</h2>
        <p className="hidden text-sm text-stone-500 md:block">Tri par type, thème, année et recherche libre.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item, index) => (
          <article key={item.slug + "-" + item.recommendation + "-" + index} className="border border-stone-800 bg-black/20 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-300 px-2.5 py-1 text-xs font-semibold text-black">{item.type}</span>
              <span className="border border-stone-700 px-2.5 py-1 text-xs text-stone-400">{item.year}</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold leading-7 text-white">{item.recommendation}</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300">Recommandation citée ou suggérée dans l'entretien avec {item.guest}.</p>
            <a href={"/interviews/" + item.slug} className="mt-5 inline-block text-sm font-semibold text-amber-200 hover:text-amber-100">
              {item.title}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-stone-700 bg-black/30 px-4 py-3 text-sm text-stone-100 outline-none focus:border-amber-300"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
