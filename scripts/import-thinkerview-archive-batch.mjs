import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, "data/interviews.json");
const TRANSCRIPT_DIR = join(ROOT, "data/transcripts");
const ARCHIVE_PATH = join(ROOT, "data/thinkerview-archive.json");
const BASE_URL = "https://www.thinkerview.com";
const PAGE_COUNT = Number(getArg("pages", "47"));
const LIMIT = Number(getArg("limit", "30"));
const CONCURRENCY = Number(getArg("concurrency", "5"));

mkdirSync(TRANSCRIPT_DIR, { recursive: true });

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const existingById = new Map(data.interviews.map((interview) => [interview.id, interview]));

const archive = await crawlArchive();
writeFileSync(ARCHIVE_PATH, `${JSON.stringify({ generated_at: new Date().toISOString(), items: archive }, null, 2)}\n`);

const missing = archive.filter((item) => item.id && !existingById.has(item.id));
const selected = missing.slice(0, LIMIT);

console.log(`archive=${archive.length}`);
console.log(`existing=${existingById.size}`);
console.log(`missing=${missing.length}`);
console.log(`selected=${selected.length}`);

await mapLimit(selected, CONCURRENCY, async (item, index) => {
  console.log(`[metadata] ${index + 1}/${selected.length} ${item.id}`);
  item.youtube = getYoutubeMetadata(item.id);
});

await mapLimit(selected, Math.max(1, Math.min(CONCURRENCY, 4)), async (item, index) => {
  console.log(`[subtitles] ${index + 1}/${selected.length} ${item.id}`);
  downloadSubtitles(item.id);
});

const newInterviews = selected.map(buildInterview);
const ids = new Set(newInterviews.map((interview) => interview.id));
data.interviews = [...newInterviews, ...data.interviews.filter((interview) => !ids.has(interview.id))];
data.generated_at = new Date().toISOString();
data.source_url = `${BASE_URL}/page/${PAGE_COUNT}/`;
data.method = "Thinkerview archive crawl + yt-dlp metadata/captions + batch editorial generation.";

writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`);
console.log(`imported=${newInterviews.length}`);
console.log(newInterviews.map((interview) => `${interview.id}\t${interview.publish_date}\t${interview.title}`).join("\n"));

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

async function crawlArchive() {
  const pageUrls = Array.from({ length: PAGE_COUNT }, (_, index) => {
    const page = index + 1;
    return page === 1 ? `${BASE_URL}/` : `${BASE_URL}/page/${page}/`;
  });

  const pages = await mapLimit(pageUrls, CONCURRENCY, async (url) => fetchText(url));
  const postUrls = unique(
    pages.flatMap((html) => extractLinks(html))
      .filter(isPostUrl)
      .map((url) => url.replace(/#.*$/, ""))
  );

  const posts = await mapLimit(postUrls, CONCURRENCY, async (url, index) => {
    if ((index + 1) % 25 === 0) console.log(`[crawl] post ${index + 1}/${postUrls.length}`);
    return parsePost(url, await fetchText(url));
  });

  return posts
    .filter((post) => post.id)
    .filter((post, index, list) => list.findIndex((candidate) => candidate.id === post.id) === index);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 ThinkerviewPortalImporter/1.0" }
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function extractLinks(html) {
  return [...html.matchAll(/href=["']([^"']+)["']/g)].map((match) => decodeEntities(match[1]));
}

function isPostUrl(url) {
  if (!url.startsWith(`${BASE_URL}/`)) return false;
  const path = new URL(url).pathname;
  if (path === "/" || path === "/contact/" || path === "/contact") return false;
  if (path.startsWith("/page/") || path.startsWith("/section/") || path.startsWith("/wp-")) return false;
  if (path.startsWith("/feed") || path.startsWith("/xmlrpc") || path.includes("podcast")) return false;
  return /^\/[a-z0-9][^/]+\/$/i.test(path);
}

function parsePost(url, html) {
  const ids = unique([...html.matchAll(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/g)].map((match) => match[1]));
  const title = decodeEntities(
    matchFirst(html, /<meta property="og:title" content="([^"]+)"/) ??
    matchFirst(html, /<title>(.*?)<\/title>/s) ??
    ""
  ).replace(/\s+-\s+Thinkerview\s*$/i, "").trim();
  const published = matchFirst(html, /"datePublished":"([^"]+)"/) ??
    matchFirst(html, /property="article:published_time" content="([^"]+)"/);

  return {
    id: ids[0] ?? null,
    title,
    page_url: url,
    publish_date: published ? formatFrenchDate(published) : null,
    publish_date_iso: published ?? null
  };
}

function getYoutubeMetadata(id) {
  try {
    const raw = execFileSync("yt-dlp", ["--skip-download", "--dump-json", `https://www.youtube.com/watch?v=${id}`], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"]
    });
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[metadata-failed] ${id} ${error.message}`);
    return {};
  }
}

function downloadSubtitles(id) {
  const before = pickTranscript(id);
  if (before.path) return;

  const baseArgs = [
    "--skip-download",
    "--write-subs",
    "--write-auto-subs",
    "--sub-format",
    "vtt",
    "-o",
    join(TRANSCRIPT_DIR, "%(id)s.%(ext)s"),
    `https://www.youtube.com/watch?v=${id}`
  ];

  spawnSync("yt-dlp", ["--sub-langs", "fr-orig,fr", ...baseArgs], { cwd: ROOT, encoding: "utf8" });
  if (pickTranscript(id).path) return;
  spawnSync("yt-dlp", ["--sub-langs", "en", ...baseArgs], { cwd: ROOT, encoding: "utf8" });
}

function buildInterview(item) {
  const youtube = item.youtube ?? {};
  const transcript = pickTranscript(item.id);
  const transcriptWords = transcript.text ? splitWords(transcript.text).length : 0;
  const title = cleanTitle(item.title || youtube.title || `Interview Thinkerview ${item.id}`);
  const guest = inferGuest(title);
  const themes = detectThemes(title, transcript.text);

  return {
    id: item.id,
    slug: `${slugify(guest)}-${item.id}`,
    title,
    guest,
    role: themes[0] ?? "interview",
    themes,
    duration: formatDuration(youtube.duration ?? 0),
    duration_seconds: Math.round(youtube.duration ?? 0),
    url: `https://www.youtube.com/watch?v=${item.id}`,
    thumbnail: youtube.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
    transcript: {
      available: transcriptWords > 300,
      language: transcript.language,
      words: transcriptWords,
      source_file: transcript.path ? `data/transcripts/${transcript.file}` : null
    },
    executive_summary: `Résumé éditorial à générer pour "${title}".`,
    sections: [
      {
        title: "Résumé à générer",
        paragraphs: [
          "Cette interview vient d'être importée depuis l'archive Thinkerview. Le résumé détaillé sera produit depuis le transcript local disponible."
        ]
      }
    ],
    method_note: "Import initial depuis archive Thinkerview et métadonnées YouTube.",
    confidence: transcriptWords > 3000 ? 0.72 : transcriptWords > 300 ? 0.52 : 0.2,
    youth_advice: "À compléter après génération du résumé.",
    reading_recommendations: ["À compléter après génération du résumé."],
    publish_date: item.publish_date ?? formatYtDate(youtube.upload_date) ?? null,
    source_page: item.page_url
  };
}

function pickTranscript(id) {
  const candidates = [`${id}.fr-orig.vtt`, `${id}.fr.vtt`, `${id}.en.vtt`];
  for (const file of candidates) {
    const path = join(TRANSCRIPT_DIR, file);
    if (!existsSync(path)) continue;
    const text = stripVtt(readFileSync(path, "utf8"));
    return {
      file,
      path,
      language: file.includes(".en.") ? "en" : file.includes(".fr-orig.") ? "fr-orig" : "fr",
      text
    };
  }
  return { file: null, path: null, language: null, text: "" };
}

function stripVtt(raw) {
  const lines = [];
  let previous = "";
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith("WEBVTT") || line.startsWith("Kind:") || line.startsWith("Language:")) continue;
    if (line.includes("-->") || /^\d+$/.test(line.trim())) continue;
    const cleaned = decodeEntities(line)
      .replace(/<[^>]+>/g, "")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned || cleaned === previous) continue;
    lines.push(cleaned);
    previous = cleaned;
  }
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function inferGuest(title) {
  const cleaned = title.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
  const [beforeColonRaw, ...afterColonParts] = cleaned.split(":");
  const beforeColon = cleanGuestCandidate(beforeColonRaw);
  const afterColon = cleanGuestCandidate(afterColonParts.join(":"));

  if (beforeColon && looksLikeGuest(beforeColon) && !looksLikeTopicLabel(beforeColon)) return beforeColon;
  if (afterColon && looksLikeGuest(afterColon)) return afterColon;

  const beforeQuestion = cleanGuestCandidate(cleaned.split("?").at(-1));
  if (beforeQuestion && looksLikeGuest(beforeQuestion)) return beforeQuestion;
  const capitalized = cleaned.match(/[A-ZÉÈÀÂÎÏÔÛÇ][\p{L}'-]+(?:\s+[A-ZÉÈÀÂÎÏÔÛÇ][\p{L}'-]+){1,5}/u);
  return capitalized?.[0] ?? "Invité à préciser";
}

function cleanGuestCandidate(value = "") {
  return value
    .replace(/\bsans filtres?\b/gi, "")
    .replace(/\bEN DIRECT\b/gi, "")
    .replace(/[?.!,;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeGuest(value) {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 8) return false;
  return words.filter((word) => /^[A-ZÉÈÀÂÎÏÔÛÇ]/.test(word)).length >= Math.min(2, words.length);
}

function looksLikeTopicLabel(value) {
  return /\b(exclusif|stress test|ovni|astrophysique|guerre|iran|france|europe|crise)\b/i.test(value);
}

function detectThemes(title, transcript) {
  const rules = [
    ["geopolitique", ["guerre", "russie", "ukraine", "iran", "afrique", "terrorisme", "diplomatie", "géopolitique", "otan"]],
    ["numerique", ["donnée", "big tech", "numérique", "internet", "algorithme", "surveillance", "cyber", "ia"]],
    ["economie", ["finance", "banque", "économie", "industrie", "dette", "crise", "monnaie", "énergie"]],
    ["democratie", ["censure", "média", "information", "démocratie", "justice", "politique", "élection"]],
    ["ecologie", ["agriculture", "climat", "écologie", "effondrement", "alimentation", "pétrole"]],
    ["societe", ["humour", "culture", "famille", "société", "violence", "éducation", "santé"]]
  ];
  const haystack = `${title} ${transcript.slice(0, 12000)}`.toLowerCase();
  const themes = rules
    .map(([topic, keys]) => ({ topic, score: keys.reduce((sum, key) => sum + (haystack.includes(key) ? 1 : 0), 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.topic);
  return themes.length ? themes : ["societe"];
}

function cleanTitle(title) {
  return decodeEntities(title).replace(/\s+-\s+Thinkerview\s*$/i, "").replace(/\s+/g, " ").trim();
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

function splitWords(text) {
  return text.split(/\s+/).filter(Boolean);
}

function formatDuration(seconds = 0) {
  const total = Math.round(seconds || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

function formatYtDate(value) {
  if (!value || !/^\d{8}$/.test(value)) return null;
  return `${value.slice(6, 8)}/${value.slice(4, 6)}/${value.slice(0, 4)}`;
}

function formatFrenchDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

function matchFirst(value, pattern) {
  return value.match(pattern)?.[1] ?? null;
}

function unique(values) {
  return [...new Set(values)];
}

function decodeEntities(value) {
  return value
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (index < values.length) {
      const current = index++;
      results[current] = await worker(values[current], current);
    }
  });
  await Promise.all(runners);
  return results;
}
