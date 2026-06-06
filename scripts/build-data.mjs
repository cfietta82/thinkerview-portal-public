import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_URL = "https://www.youtube.com/@thinkerview/videos?view=2&sort=dd&live_view=503&shelf_id=1";
const TRANSCRIPT_DIR = "data/transcripts";
const OUTPUT_PATH = "data/interviews.json";

const topicRules = [
  ["geopolitique", ["guerre", "russie", "ukraine", "afrique", "terrorisme", "diplomatie", "assange", "géopolitique", "otan"]],
  ["numerique", ["donnée", "métadonnée", "big brother", "numérique", "internet", "algorithme", "surveillance", "cyber"]],
  ["economie", ["finance", "banque", "économie", "euro", "dette", "crise", "monnaie", "énergie"]],
  ["democratie", ["présidentielle", "censure", "média", "information", "démocratie", "justice", "politique"]],
  ["ecologie", ["collapsologie", "énergie", "climat", "sea shepherd", "écologie", "effondrement"]],
  ["societe", ["jeunesse", "dépression", "anxiété", "violence", "culture", "famille", "société"]]
];

const sectionTitles = [
  "Cadre de départ",
  "Point de diagnostic",
  "Mécanismes et rapports de force",
  "Conséquences concrètes",
  "Objections et nuances",
  "Angle politique",
  "Méthode de lecture",
  "Synthèse finale"
];

function listVideos() {
  const out = execFileSync("yt-dlp", ["--flat-playlist", "--dump-json", SOURCE_URL], { encoding: "utf8" });
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((video) => video.id && video.title);
}

function stripVtt(raw) {
  const lines = raw.split(/\r?\n/);
  const chunks = [];
  let previous = "";

  for (const line of lines) {
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

function pickTranscript(id) {
  const candidates = [
    `${id}.fr-orig.vtt`,
    `${id}.fr.vtt`,
    `${id}.en.vtt`
  ];

  for (const file of candidates) {
    const path = join(TRANSCRIPT_DIR, file);
    if (existsSync(path)) {
      return {
        path,
        language: file.includes(".en.") ? "en" : file.includes(".fr-orig.") ? "fr-orig" : "fr",
        text: stripVtt(readFileSync(path, "utf8"))
      };
    }
  }

  return { path: null, language: null, text: "" };
}

function formatDuration(seconds = 0) {
  const total = Math.round(seconds || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function inferGuest(title) {
  const cleaned = title.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
  const questionSplit = cleaned.split("?").map((part) => part.trim()).filter(Boolean);
  const tail = questionSplit.length > 1 ? questionSplit.at(-1) : cleaned.split(" - ").at(0);
  const withoutLive = tail.replace(/\bEN DIRECT\b/gi, "").replace(/\bSans Filtre\b/gi, "").trim();
  const words = withoutLive.split(/\s+/).filter(Boolean);

  if (words.length >= 2 && words.length <= 6) return withoutLive;
  const capitalized = cleaned.match(/[A-ZÉÈÀÂÎÏÔÛÇ][\p{L}'-]+(?:\s+[A-ZÉÈÀÂÎÏÔÛÇ][\p{L}'-]+){1,4}/u);
  return capitalized?.[0] ?? "Invité à préciser";
}

function detectThemes(title, transcript) {
  const haystack = `${title} ${transcript.slice(0, 12000)}`.toLowerCase();
  const matches = topicRules
    .map(([topic, keys]) => ({
      topic,
      score: keys.reduce((acc, key) => acc + (haystack.includes(key) ? 1 : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.topic);

  return matches.length ? matches : ["societe"];
}

function splitWords(text) {
  return text.split(/\s+/).filter(Boolean);
}

function chunkText(text, targetWords = 520, maxChunks = 10) {
  const words = splitWords(text);
  if (!words.length) return [];
  const size = Math.max(targetWords, Math.ceil(words.length / maxChunks));
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(" "));
  }
  return chunks.slice(0, maxChunks);
}

function leadingExcerpt(text, maxWords = 68) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const selected = sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24)
    .slice(0, 3)
    .join(" ");
  return splitWords(selected).slice(0, maxWords).join(" ");
}

function topTerms(text) {
  const stop = new Set([
    "alors", "avoir", "comme", "dans", "donc", "elle", "elles", "entre", "faire", "fait", "faut", "mais",
    "nous", "pour", "plus", "quand", "quoi", "sans", "sont", "tout", "vous", "avec", "cette", "être",
    "parce", "qu'il", "qu'on", "c'est", "est-ce", "très", "bien", "cela", "dire", "gens", "peut"
  ]);
  const counts = new Map();
  for (const word of text.toLowerCase().match(/[\p{L}'-]{5,}/gu) ?? []) {
    if (stop.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([word]) => word);
}

function buildSections(transcript, title, themes) {
  const chunks = chunkText(transcript);
  if (!chunks.length) {
    return [{
      title: "Résumé indisponible",
      paragraphs: [
        "Aucun transcript exploitable n'a été récupéré pour cette interview. La page conserve les métadonnées et le lien source.",
        "Un résumé détaillé nécessitera soit un transcript manuel, soit une transcription audio dédiée."
      ]
    }];
  }

  return chunks.map((chunk, index) => {
    const terms = topTerms(chunk);
    const excerpt = leadingExcerpt(chunk);
    const titlePrefix = sectionTitles[index] ?? `Développement ${index + 1}`;
    const focus = terms.slice(0, 4).join(", ");
    const themeLine = themes.length ? themes.join(", ") : "les enjeux de l'entretien";

    return {
      title: `${index + 1}. ${titlePrefix}`,
      paragraphs: [
        `Cette partie de l'entretien recentre le propos sur ${focus || themeLine}. Le fil reste lié au sujet annoncé: ${title}.`,
        `Dans le détail, l'invité développe ce passage autour de la séquence suivante: ${excerpt}.`,
        `Le ton demeure celui d'un entretien Thinkerview: progression par relances, tension critique, prudence sur les faits et volonté de pousser le raisonnement jusqu'à ses conséquences.`
      ]
    };
  });
}

function buildExecutiveSummary(title, guest, themes, sections) {
  const themeLabel = themes.join(", ");
  const first = sections[0]?.paragraphs?.[1] ?? "";
  return `L'entretien avec ${guest} part de "${title}" et déroule une discussion structurée autour de ${themeLabel}. Le résumé ci-dessous suit le transcript dans l'ordre de l'échange: il privilégie la conservation des idées, des enchaînements et du ton plutôt qu'une réduction trop courte. ${first.replace(/^Dans le détail, /, "")}`;
}

function buildInterview(video) {
  const transcript = pickTranscript(video.id);
  const guest = inferGuest(video.title);
  const themes = detectThemes(video.title, transcript.text);
  const sections = buildSections(transcript.text, video.title, themes);
  const transcriptWords = splitWords(transcript.text).length;

  return {
    id: video.id,
    slug: `${slugify(guest)}-${video.id}`,
    title: video.title,
    guest,
    role: themes[0] ?? "interview",
    themes,
    publish_date: video.upload_date ?? video.publish_date ?? null,
    duration: formatDuration(video.duration),
    duration_seconds: Math.round(video.duration ?? 0),
    url: video.url,
    thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    transcript: {
      available: transcriptWords > 300,
      language: transcript.language,
      words: transcriptWords,
      source_file: transcript.path
    },
    executive_summary: buildExecutiveSummary(video.title, guest, themes, sections),
    sections,
    method_note: "Résumé extractif généré depuis les sous-titres automatiques YouTube. Une passe LLM authentifiée améliorerait la synthèse et la reformulation.",
    confidence: transcriptWords > 3000 ? 0.72 : transcriptWords > 300 ? 0.52 : 0.25
  };
}

const videos = listVideos();
const interviews = videos.map(buildInterview);

const data = {
  generated_at: new Date().toISOString(),
  source_url: SOURCE_URL,
  channel: {
    name: "Thinkerview",
    id: "UCQgWpmt02UtJkyO32HGUASQ"
  },
  schema_version: "3.0",
  method: "yt-dlp metadata + YouTube auto captions + local extractive summarizer",
  interviews
};

writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Generated ${interviews.length} interviews into ${OUTPUT_PATH}`);
