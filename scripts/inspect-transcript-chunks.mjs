import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const data = JSON.parse(readFileSync(join(ROOT, "data/interviews.json"), "utf8"));
const ids = process.argv.slice(2);

for (const id of ids) {
  const interview = data.interviews.find((item) => item.id === id);
  if (!interview?.transcript?.source_file) {
    console.log(`\n### ${id} | transcript unavailable`);
    continue;
  }

  const transcript = stripVtt(readFileSync(join(ROOT, interview.transcript.source_file), "utf8"));
  const words = transcript.split(/\s+/);
  console.log(`\n### ${id} | ${interview.title} | words=${words.length}`);

  const chunks = 10;
  for (let index = 0; index < chunks; index += 1) {
    const start = Math.floor((index * words.length) / chunks);
    const excerpt = words.slice(start, start + 220).join(" ");
    console.log(`\n-- chunk ${index + 1} --\n${excerpt}`);
  }
}

function stripVtt(raw) {
  const words = [];

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith("WEBVTT") || line.startsWith("Kind:") || line.startsWith("Language:")) continue;
    if (line.includes("-->") || /^\d+$/.test(line.trim())) continue;

    const cleaned = line
      .replace(/<[^>]+>/g, "")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) continue;

    const lineWords = cleaned.split(/\s+/);
    let overlap = 0;
    const max = Math.min(30, words.length, lineWords.length);

    for (let size = max; size > 0; size -= 1) {
      if (words.slice(-size).join(" ").toLowerCase() === lineWords.slice(0, size).join(" ").toLowerCase()) {
        overlap = size;
        break;
      }
    }

    words.push(...lineWords.slice(overlap));
  }

  return words
    .join(" ")
    .replace(/\b([\p{L}\p{N}]{2,})(?:\s+\1\b){1,}/giu, "$1")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
