import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, "data/interviews.json");
const OUT_DIR = join(ROOT, "data/editorial-summaries");
const CODEX_BIN =
  process.env.CODEX_BIN ??
  "/home/cfietta/.openclaw/npm/projects/openclaw-codex-8902d781d4/node_modules/@openclaw/codex/node_modules/@openai/codex/bin/codex.js";

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, value] = arg.split("=");
  args.set(key.replace(/^--/, ""), value ?? "true");
}

const limit = args.has("limit") ? Number(args.get("limit")) : Infinity;
const start = args.has("start") ? Number(args.get("start")) : 0;
const force = args.get("force") === "true";
const only = args.get("only");
const model = args.get("model") ?? process.env.SUMMARY_MODEL ?? "gpt-5.4";
const DEFAULT_CODEX_HOME = "/home/cfietta/.codex";
const inheritedCodexHome = process.env.CODEX_HOME;
const CODEX_HOME =
  args.get("codex-home") ??
  (!inheritedCodexHome || inheritedCodexHome.includes("/.openclaw/agents/") ? DEFAULT_CODEX_HOME : inheritedCodexHome);

mkdirSync(OUT_DIR, { recursive: true });

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const selected = data.interviews
  .map((interview, index) => ({ interview, index }))
  .filter(({ interview, index }) => index >= start && (!only || interview.id === only))
  .slice(0, limit);

for (const { interview, index } of selected) {
  const outputPath = join(OUT_DIR, `${interview.id}.json`);
  if (!force && existsSync(outputPath)) {
    console.log(`[skip] ${index + 1}/${data.interviews.length} ${interview.id} ${interview.guest}`);
    continue;
  }

  if (!interview.transcript?.available || !interview.transcript.source_file) {
    writeFileSync(outputPath, JSON.stringify(buildUnavailableSummary(), null, 2));
    console.log(`[no transcript] ${index + 1}/${data.interviews.length} ${interview.id} ${interview.guest}`);
    continue;
  }

  const transcriptPath = join(ROOT, interview.transcript.source_file);
  const transcript = stripVtt(readFileSync(transcriptPath, "utf8"));
  const prompt = buildPrompt(interview);
  const tmpOut = join(OUT_DIR, `${interview.id}.raw.md`);

  console.log(`[generate] ${index + 1}/${data.interviews.length} ${interview.id} ${interview.guest} (${wordCount(transcript)} words)`);

  const result = spawnSync(
    "bash",
    [
      "-lc",
      'CODEX_HOME="$1" node "$2" exec -m "$3" --skip-git-repo-check --sandbox danger-full-access -C "$4" -o "$5" "$6"',
      "codex-editorial",
      CODEX_HOME,
      CODEX_BIN,
      model,
      ROOT,
      tmpOut,
      prompt
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_HOME
      },
      maxBuffer: 1024 * 1024 * 32
    }
  );

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    throw new Error(`Codex generation failed for ${interview.id}`);
  }

  const raw = readFileSync(tmpOut, "utf8").trim();
  const parsed = parseJson(raw);
  validateSummary(parsed, interview);
  writeFileSync(outputPath, JSON.stringify({ ...parsed, generated_at: new Date().toISOString() }, null, 2));
}

function buildPrompt(interview) {
  return `Tu produis un résumé éditorial long pour une page Thinkerview.

Contraintes absolues:
- Réponds uniquement en JSON valide, sans markdown, sans texte avant/après.
- N'invente aucun fait absent du transcript.
- Conserve les idées importantes de l'interviewé, ses enchaînements et son ton.
- Ne fais pas une synthèse courte: il faut une lecture longue et détaillée.
- Si le transcript est en anglais, rédige quand même en français.
- N'utilise pas de citations exactes longues; paraphrase fidèlement.
- Chaque section doit suivre l'ordre réel de l'entretien.

Format JSON attendu:
{
  "executive_summary": "Synthèse exécutive concise des 10 idées clés de l'interview, sous forme de 10 phrases numérotées.",
  "youth_advice": "Conseil final aux jeunes générations, formulé comme une synthèse fidèle. Si aucun conseil explicite n'existe, extraire prudemment l'orientation pratique la plus directement présente dans la conclusion.",
  "reading_recommendations": ["Livre, auteur, source primaire ou type de lecture recommandé explicitement dans l'entretien."],
  "sections": [
    {
      "title": "1. Titre analytique",
      "paragraphs": ["Paragraphe détaillé.", "Paragraphe détaillé."]
    }
  ],
  "method_note": "Note courte indiquant que le résumé est généré depuis le transcript disponible.",
  "confidence": 0.92
}

Exigences de contenu:
- 8 à 14 sections selon la richesse du transcript.
- 2 à 4 paragraphes par section.
- executive_summary ne doit pas refaire le résumé long: il doit isoler les 10 idées clés, clairement, sans conclusion lyrique ni extrapolation.
- Inclure les nuances, objections, désaccords et limites méthodologiques quand elles apparaissent.
- Terminer par une section de conclusion si l'entretien en contient la matière.
- Remplir youth_advice et reading_recommendations pour alimenter le cartouche de présentation.
- Pour reading_recommendations, ne pas inventer de titres de livres: si l'invité ne cite pas de livre, retenir les sources, corpus ou pratiques de lecture explicitement conseillés.
- Le style doit ressembler à un dossier analytique premium, pas à des bullets automatiques.

Métadonnées:
- ID: ${interview.id}
- Titre: ${interview.title}
- Invité: ${interview.guest}
- Durée: ${interview.duration}
- Thèmes actuels: ${interview.themes.join(", ")}
- Fichier transcript à lire entièrement: ${interview.transcript.source_file}

Lis le fichier transcript indiqué depuis le répertoire projet. Ne modifie aucun fichier.`;
}

function buildUnavailableSummary() {
  return {
    executive_summary:
      "Aucun transcript exploitable n'est disponible pour cette interview. La page conserve les métadonnées, le lien source et une note méthodologique afin de ne pas inventer de contenu.",
    sections: [
      {
        title: "1. Transcript indisponible",
        paragraphs: [
          "Cette interview ne dispose pas encore d'un transcript local fiable. Un résumé détaillé fidèle nécessitera une transcription audio ou un sous-titrage récupérable.",
          "Le contenu éditorial long est volontairement laissé en attente afin d'éviter une synthèse spéculative fondée sur le seul titre."
        ]
      }
    ],
    method_note: "Résumé non généré: transcript local indisponible.",
    confidence: 0.2,
    generated_at: new Date().toISOString()
  };
}

function stripVtt(raw) {
  const chunks = [];
  let previous = "";

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith("WEBVTT") || line.startsWith("Kind:") || line.startsWith("Language:")) continue;
    if (line.includes("-->")) continue;
    if (/^\d+$/.test(line.trim())) continue;

    const cleaned = line
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned || cleaned === previous) continue;
    chunks.push(cleaned);
    previous = cleaned;
  }

  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in model output");
    return JSON.parse(match[0]);
  }
}

function validateSummary(summary, interview) {
  if (typeof summary.executive_summary !== "string" || summary.executive_summary.length < 700) {
    throw new Error(`Executive summary too short for ${interview.id}`);
  }
  if (typeof summary.youth_advice !== "string" || summary.youth_advice.length < 40) {
    throw new Error(`Missing youth advice for ${interview.id}`);
  }
  if (!Array.isArray(summary.reading_recommendations) || summary.reading_recommendations.length < 1) {
    throw new Error(`Missing reading recommendations for ${interview.id}`);
  }
  if (!Array.isArray(summary.sections) || summary.sections.length < 6) {
    throw new Error(`Not enough sections for ${interview.id}`);
  }
  for (const section of summary.sections) {
    if (typeof section.title !== "string" || !Array.isArray(section.paragraphs) || section.paragraphs.length < 1) {
      throw new Error(`Invalid section for ${interview.id}`);
    }
  }
  if (typeof summary.method_note !== "string") {
    throw new Error(`Missing method note for ${interview.id}`);
  }
  if (typeof summary.confidence !== "number") {
    throw new Error(`Missing confidence for ${interview.id}`);
  }
}

function wordCount(value) {
  return value.split(/\s+/).filter(Boolean).length;
}
