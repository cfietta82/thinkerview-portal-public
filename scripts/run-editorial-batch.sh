#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/data/editorial-summaries"
STATE_DIR="$OUT_DIR/.batch"
CODEX_BIN="${CODEX_BIN:-/home/cfietta/.openclaw/npm/projects/openclaw-codex-8902d781d4/node_modules/@openclaw/codex/node_modules/@openai/codex/bin/codex.js}"
CODEX_HOME="${CODEX_HOME:-/home/cfietta/.codex}"

mkdir -p "$OUT_DIR" "$STATE_DIR"

ITEMS="$STATE_DIR/items.tsv"
node - "$ROOT" > "$ITEMS" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const data = JSON.parse(fs.readFileSync(path.join(root, "data/interviews.json"), "utf8"));
for (const interview of data.interviews) {
  const fields = [
    interview.id,
    interview.title,
    interview.guest,
    interview.duration,
    (interview.themes ?? []).join(", "),
    interview.transcript?.available ? "1" : "0",
    interview.transcript?.source_file ?? ""
  ];
  console.log(fields.map((value) => String(value).replace(/\t/g, " ")).join("\t"));
}
NODE

started_at="$(date -Is)"
echo "[batch] started_at=$started_at"
echo "[batch] root=$ROOT"

while IFS=$'\t' read -r id title guest duration themes has_transcript transcript_file; do
  out="$OUT_DIR/$id.json"
  raw="$OUT_DIR/$id.raw.md"

  if [[ -s "$out" ]]; then
    echo "[skip] $id $guest"
    continue
  fi

  if [[ "$has_transcript" != "1" || -z "$transcript_file" ]]; then
    echo "[no transcript] $id $guest"
    node - "$out" <<'NODE'
const fs = require("fs");
const out = process.argv[2];
const summary = {
  executive_summary: "Aucun transcript exploitable n'est disponible pour cette interview. La page conserve les métadonnées, le lien source et une note méthodologique afin de ne pas inventer de contenu.",
  sections: [{
    title: "1. Transcript indisponible",
    paragraphs: [
      "Cette interview ne dispose pas encore d'un transcript local fiable. Un résumé détaillé fidèle nécessitera une transcription audio ou un sous-titrage récupérable.",
      "Le contenu éditorial long est volontairement laissé en attente afin d'éviter une synthèse spéculative fondée sur le seul titre."
    ]
  }],
  method_note: "Résumé non généré: transcript local indisponible.",
  confidence: 0.2,
  generated_at: new Date().toISOString()
};
fs.writeFileSync(out, JSON.stringify(summary, null, 2) + "\n");
NODE
    continue
  fi

  echo "[generate] $id $guest"

  prompt="Tu produis un résumé éditorial long pour une page Thinkerview.

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
  \"executive_summary\": \"Résumé exécutif dense en 2 à 4 paragraphes.\",
  \"sections\": [
    { \"title\": \"1. Titre analytique\", \"paragraphs\": [\"Paragraphe détaillé.\", \"Paragraphe détaillé.\"] }
  ],
  \"method_note\": \"Note courte indiquant que le résumé est généré depuis le transcript disponible.\",
  \"confidence\": 0.92
}

Exigences:
- 8 à 14 sections selon la richesse du transcript.
- 2 à 4 paragraphes par section.
- Inclure nuances, objections, désaccords et limites méthodologiques.
- Style dossier analytique premium, pas bullets automatiques.

Métadonnées:
- ID: $id
- Titre: $title
- Invité: $guest
- Durée: $duration
- Thèmes actuels: $themes
- Fichier transcript à lire entièrement: $transcript_file

Lis le fichier transcript indiqué depuis le répertoire projet. Ne modifie aucun fichier."

  set +e
  CODEX_HOME="$CODEX_HOME" node "$CODEX_BIN" exec -m gpt-5.5 --skip-git-repo-check --sandbox danger-full-access -C "$ROOT" -o "$raw" "$prompt" < /dev/null
  status=$?
  set -e

  if [[ "$status" -ne 0 ]]; then
    echo "[failed] $id status=$status"
    echo "$id" >> "$STATE_DIR/failed.txt"
    continue
  fi

  node - "$raw" "$out" "$id" <<'NODE'
const fs = require("fs");
const [rawPath, outPath, id] = process.argv.slice(2);
const raw = fs.readFileSync(rawPath, "utf8").trim();
let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON object found for ${id}`);
  parsed = JSON.parse(match[0]);
}
if (typeof parsed.executive_summary !== "string" || parsed.executive_summary.length < 400) throw new Error(`Executive summary too short for ${id}`);
if (!Array.isArray(parsed.sections) || parsed.sections.length < 6) throw new Error(`Not enough sections for ${id}`);
if (typeof parsed.method_note !== "string") throw new Error(`Missing method_note for ${id}`);
if (typeof parsed.confidence !== "number") throw new Error(`Missing numeric confidence for ${id}`);
parsed.generated_at = new Date().toISOString();
fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2) + "\n");
NODE

  echo "[done] $id $guest"
done < "$ITEMS"

node "$ROOT/scripts/merge-editorial-summaries.mjs"
echo "[batch] finished_at=$(date -Is)"
