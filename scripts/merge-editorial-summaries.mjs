import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, "data/interviews.json");
const SUMMARY_DIR = join(ROOT, "data/editorial-summaries");

function needsRegenerationSummary(interview) {
  return {
    executive_summary:
      `Résumé à régénérer pour "${interview.title}". Les métadonnées et le lien source sont conservés, mais le résumé éditorial long a été retiré car il n'a pas encore passé la validation qualitative.`,
    sections: [
      {
        title: "1. Résumé à régénérer",
        paragraphs: [
          "Cette interview dispose de métadonnées et, lorsque disponible, d'un transcript local. Le résumé éditorial détaillé doit être reconstruit progressivement à partir de cette source, interview par interview.",
          "Ce statut évite d'afficher une synthèse non validée ou produite par un ancien lot de génération jugé insuffisant."
        ]
      }
    ],
    youth_advice: "À compléter après régénération du résumé depuis un transcript exploitable.",
    reading_recommendations: ["À compléter après régénération éditoriale depuis la source vérifiable."],
    method_note: "Résumé éditorial à régénérer progressivement depuis le transcript local.",
    confidence: 0.1
  };
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
let merged = 0;
let missing = 0;

for (const interview of data.interviews) {
  const summaryPath = join(SUMMARY_DIR, `${interview.id}.json`);
  if (!existsSync(summaryPath)) {
    const placeholder = needsRegenerationSummary(interview);
    interview.executive_summary = placeholder.executive_summary;
    interview.sections = placeholder.sections;
    interview.youth_advice = placeholder.youth_advice;
    interview.reading_recommendations = placeholder.reading_recommendations;
    interview.method_note = placeholder.method_note;
    interview.confidence = placeholder.confidence;
    missing += 1;
    continue;
  }

  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  interview.executive_summary = summary.executive_summary;
  interview.sections = summary.sections;
  interview.youth_advice = summary.youth_advice;
  interview.reading_recommendations = summary.reading_recommendations;
  interview.method_note = summary.method_note;
  interview.confidence = summary.confidence;
  merged += 1;
}

data.generated_at = new Date().toISOString();
data.method = "Codex editorial summaries generated from local VTT transcripts; metadata preserved from yt-dlp extraction.";

writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`);

console.log(`merged=${merged}`);
console.log(`missing=${missing}`);
