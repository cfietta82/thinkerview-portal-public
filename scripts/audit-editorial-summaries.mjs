import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SUMMARY_DIR = join(ROOT, "data/editorial-summaries");
const ids = process.argv.slice(2);
const files = ids.length
  ? ids.map((id) => `${id.replace(/\.json$/, "")}.json`)
  : readdirSync(SUMMARY_DIR).filter((file) => file.endsWith(".json")).sort();

const forbiddenMarkers = [
  "Cette partie pose le cadre",
  "L'idée formulée est que",
  "Le raisonnement avance que",
  "La nuance importante tient",
  "Le passage fonctionne comme une étape",
  "Cette séquence installe le raisonnement",
  "Une formulation marquante indique que",
  "Le propos enchaîne sur le fait que",
  "La limite de lecture vient du caractère oral",
  "Ce moment prépare les développements suivants",
  "lecture vient du caractère oral du transcript"
];
const accentPattern = /[éèêëàâäîïôöùûüçÉÈÊËÀÂÄÎÏÔÖÙÛÜÇ]/;

let failures = 0;

for (const file of files) {
  const filePath = join(SUMMARY_DIR, file);
  const id = file.replace(/\.json$/, "");

  if (!existsSync(filePath)) {
    report(id, ["fichier absent"]);
    continue;
  }

  const raw = readFileSync(filePath, "utf8");
  const errors = [];
  let summary;

  try {
    summary = JSON.parse(raw);
  } catch {
    report(id, ["JSON invalide"]);
    continue;
  }

  const paragraphs = Array.isArray(summary.sections)
    ? summary.sections.flatMap((section) => section.paragraphs ?? [])
    : [];
  const text = [
    summary.executive_summary,
    summary.youth_advice,
    ...(summary.reading_recommendations ?? []),
    ...paragraphs
  ].join("\n");
  const isUnavailable = summary.confidence <= 0.2;

  if (typeof summary.executive_summary !== "string" || summary.executive_summary.length < (isUnavailable ? 120 : 700)) {
    errors.push("executive_summary trop court");
  }
  if (!Array.isArray(summary.sections) || summary.sections.length < (isUnavailable ? 1 : 8)) {
    errors.push("sections insuffisantes");
  }
  if (paragraphs.length < (isUnavailable ? 1 : 24)) {
    errors.push("paragraphes insuffisants");
  }
  if (typeof summary.youth_advice !== "string" || summary.youth_advice.length < 40) {
    errors.push("youth_advice absent ou trop court");
  }
  if (!Array.isArray(summary.reading_recommendations) || summary.reading_recommendations.length < 1) {
    errors.push("reading_recommendations absent");
  }
  if (typeof summary.method_note !== "string" || summary.method_note.length < 30) {
    errors.push("method_note absente");
  }
  if (typeof summary.confidence !== "number" || summary.confidence < 0 || summary.confidence > 1) {
    errors.push("confidence invalide");
  }
  if (!isUnavailable && !accentPattern.test(text)) {
    errors.push("accents français absents");
  }
  for (const marker of forbiddenMarkers) {
    if (text.includes(marker)) errors.push(`marqueur mécanique détecté: ${marker}`);
  }

  report(id, errors, {
    sections: summary.sections?.length ?? 0,
    paragraphs: paragraphs.length,
    executiveSummaryLength: summary.executive_summary?.length ?? 0,
    confidence: summary.confidence
  });
}

if (failures > 0) process.exit(1);

function report(id, errors, stats = {}) {
  if (errors.length) {
    failures += 1;
    console.log(`[fail] ${id}: ${errors.join("; ")}`);
    return;
  }

  console.log(
    `[ok] ${id}: sections=${stats.sections}, paragraphs=${stats.paragraphs}, summary=${stats.executiveSummaryLength}, confidence=${stats.confidence}`
  );
}
