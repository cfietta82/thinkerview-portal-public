import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, "data/interviews.json");
const OUT_DIR = join(ROOT, "data/editorial-summaries");
const GENERATED_AT = new Date().toISOString();
const STOPWORDS = new Set(
  `
  alors assez aussi autre autres avant avec avoir avons beaucoup bien bon bonne c est cest cette ceux chaque comme comment
  dans donc dont elle elles encore entre etre etait etaient faites fait faire fois faut gens grand grande il ils jai
  quand lorsque mais meme memes merci moins parce pendant peut peux plus pour pourquoi premier prendre puis quel quelle
  quelles quelques quoi sans sont sous sujet suis tres trop vais veut veux vous votre vraiment chose quelque tout monde
  leur leurs vont dire faire cette cela ceux celles nous notre votre peut plus moins truc vraiment exemple genre
  about after again against also although always because been being between both could does doing dont each either every
  from have here into itself just many more most much must only other over same should some such than that their them
  then there these they this those through under very were what when where which while with would
  thinkerview interview interviewer monsieur madame skype direct bonsoir question reponse repond demande explique
  `.
    split(/\s+/)
    .filter(Boolean)
);

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, value] = arg.split("=");
  args.set(key.replace(/^--/, ""), value ?? "true");
}

const force = args.get("force") === "true";
const only = args.get("only");
const preserveValidated = args.get("preserve-validated") !== "false";

mkdirSync(OUT_DIR, { recursive: true });

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
let generated = 0;
let skipped = 0;
let unavailable = 0;

for (const interview of data.interviews) {
  if (only && interview.id !== only) continue;

  const outputPath = join(OUT_DIR, `${interview.id}.json`);
  if (preserveValidated && interview.id === "OsIY1QBunes" && existsSync(outputPath) && !only) {
    skipped += 1;
    continue;
  }
  if (!force && existsSync(outputPath)) {
    skipped += 1;
    continue;
  }

  const summary = buildSummary(interview);
  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  generated += 1;
  if (!interview.transcript?.available || !interview.transcript.source_file) unavailable += 1;
  console.log(`[generated] ${interview.id} ${interview.guest}`);
}

console.log(`generated=${generated}`);
console.log(`skipped=${skipped}`);
console.log(`unavailable=${unavailable}`);

function buildSummary(interview) {
  if (!interview.transcript?.available || !interview.transcript.source_file) {
    return buildUnavailableSummary(interview);
  }

  const transcriptPath = join(ROOT, interview.transcript.source_file);
  if (!existsSync(transcriptPath)) {
    return buildUnavailableSummary(interview, "source_file absent du disque");
  }

  const transcript = stripVtt(readFileSync(transcriptPath, "utf8"));
  const words = wordCount(transcript);
  if (words < 30) {
    return buildUnavailableSummary(interview, "transcript trop court pour un résumé fiable");
  }

  const sentences = splitSentences(transcript);
  const sectionCount = targetSectionCount(words, interview.duration_seconds);
  const chunks = chunkSentences(sentences, sectionCount);
  const sections = chunks.map((chunk, index) => buildSection(chunk, index, interview));

  return {
    executive_summary: buildExecutiveSummary(interview, sections, transcript, words),
    youth_advice: buildYouthAdvice(sections),
    reading_recommendations: buildReadingRecommendations(sections, transcript),
    sections,
    method_note: buildMethodNote(interview, words),
    confidence: confidenceFor(interview, words),
    generated_at: GENERATED_AT
  };
}

function buildUnavailableSummary(interview, reason = "transcript local indisponible") {
  return {
    executive_summary:
      `Aucun résumé éditorial long n'a été généré pour "${interview.title}", car le transcript local exploitable est indisponible. La page conserve les métadonnées de l'interview, mais le contenu analytique doit rester en attente pour éviter d'inventer des positions, des arguments ou des enchaînements qui ne figurent pas dans une source vérifiable.`,
    sections: [
      {
        title: "1. Transcript indisponible",
        paragraphs: [
          `Le fichier de sous-titres local associé à cette interview n'est pas disponible ou n'est pas exploitable: ${reason}. Dans ces conditions, un résumé fidèle ne peut pas être produit à partir du seul titre.`,
          "La bonne suite éditoriale consiste à récupérer ou produire une transcription fiable, puis à reconstruire le dossier en suivant l'ordre de l'entretien. Cette note volontairement minimale sert de garde-fou contre une synthèse spéculative."
        ]
      }
    ],
    youth_advice: "À compléter après récupération d'un transcript exploitable.",
    reading_recommendations: ["À compléter après reprise depuis une source vérifiable."],
    method_note: `Résumé non généré: ${reason}.`,
    confidence: 0.2,
    generated_at: GENERATED_AT
  };
}

function stripVtt(raw) {
  const words = [];

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith("WEBVTT") || line.startsWith("Kind:") || line.startsWith("Language:")) continue;
    if (line.includes("-->")) continue;
    if (/^\d+$/.test(line.trim())) continue;

    const cleaned = decodeEntities(line)
      .replace(/<[^>]+>/g, "")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/♪[^♪]*♪/g, "")
      .replace(/\s+/g, " ")
      .replace(/\b([\p{L}\p{N}]{2,})(?:\s+\1\b){1,}/giu, "$1")
      .trim();

    if (!cleaned || cleaned.length < 2) continue;

    const lineWords = cleaned.split(/\s+/);
    const tail = words.slice(-80).join(" ").toLowerCase();
    if (tail.includes(cleaned.toLowerCase())) continue;

    let overlap = 0;
    const maxOverlap = Math.min(40, words.length, lineWords.length);
    for (let size = maxOverlap; size > 0; size -= 1) {
      const a = words.slice(-size).join(" ").toLowerCase();
      const b = lineWords.slice(0, size).join(" ").toLowerCase();
      if (a === b) {
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

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function splitSentences(text) {
  let sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ0-9"“«])/)
    .map(cleanSentence)
    .filter((sentence) => sentence.length > 35);

  if (sentences.length < Math.max(8, wordCount(text) / 220)) {
    const tokens = text.split(/\s+/);
    sentences = [];
    for (let i = 0; i < tokens.length; i += 38) {
      sentences.push(cleanSentence(tokens.slice(i, i + 46).join(" ")));
    }
  }

  return sentences.filter(Boolean);
}

function cleanSentence(sentence) {
  return sentence
    .replace(/\b(euh|heu|ben|bah|voila|voilà)\b[, ]*/gi, "")
    .replace(/\b([\p{L}\p{N}]{2,})(?:\s+\1\b){1,}/giu, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function targetSectionCount(words, durationSeconds = 0) {
  if (words < 500 || durationSeconds < 240) return 2;
  if (words < 1200 || durationSeconds < 600) return 3;
  if (words < 3500 || durationSeconds < 1800) return 5;
  if (words < 7000) return 8;
  if (words < 12000) return 10;
  if (words < 19000) return 12;
  return 14;
}

function chunkSentences(sentences, wanted) {
  if (sentences.length <= wanted) return sentences.map((sentence) => [sentence]);

  const totalWords = sentences.reduce((sum, sentence) => sum + wordCount(sentence), 0);
  const target = Math.max(120, Math.ceil(totalWords / wanted));
  const chunks = [];
  let current = [];
  let currentWords = 0;

  for (const sentence of sentences) {
    current.push(sentence);
    currentWords += wordCount(sentence);
    const remainingSentences = sentences.length - chunks.flat().length - current.length;
    const remainingChunks = wanted - chunks.length - 1;
    if (currentWords >= target && remainingChunks > 0 && remainingSentences >= remainingChunks) {
      chunks.push(current);
      current = [];
      currentWords = 0;
    }
  }
  if (current.length) chunks.push(current);

  while (chunks.length > wanted) {
    const last = chunks.pop();
    chunks[chunks.length - 1].push(...last);
  }

  return chunks;
}

function buildSection(sentences, index, interview) {
  const sectionText = sentences.join(" ");
  const keywords = topKeywords(sectionText, interview);
  const paragraphCount = paragraphCountFor(wordCount(sectionText));
  const parts = chunkSentences(sentences, paragraphCount);
  const paragraphs = parts.map((part, partIndex) => buildParagraph(part, partIndex, keywords, interview));

  return {
    title: `${index + 1}. ${buildTitle(keywords, index, interview)}`,
    paragraphs
  };
}

function paragraphCountFor(words) {
  if (words < 220) return 1;
  if (words < 680) return 2;
  if (words < 1350) return 3;
  return 4;
}

function buildParagraph(sentences, partIndex, keywords, interview) {
  const chosen = representativeSentences(sentences, keywords, partIndex === 0 ? 3 : 2);
  const theme = themePhrase(interview.themes, keywords);
  const opening = [
    `Le passage aborde ${theme} par une entrée concrète, en partant des éléments que l'invité met lui-même au premier plan.`,
    `L'argumentation se déplace ensuite vers ${keywords.slice(0, 2).join(" et ") || theme}, avec une attention particulière aux effets pratiques.`,
    `La discussion précise les rapports de force en jeu et donne davantage de poids aux exemples développés dans l'entretien.`,
    `La tension principale tient ici au décalage entre les principes affichés et les mécanismes décrits par l'invité.`,
    `Le raisonnement insiste enfin sur les conséquences collectives, en reliant les cas évoqués aux choix politiques ou stratégiques.`
  ][partIndex % 5];

  const ideas = chosen.map((sentence, sentenceIndex) => ideaSentence(sentence, sentenceIndex));
  const close = closingSentence(theme, keywords, partIndex);

  return `${opening} ${ideas.join(" ")} ${close}`;
}

function representativeSentences(sentences, keywords, limit) {
  const scored = sentences
    .map((sentence, index) => ({
      sentence,
      index,
      score: scoreSentence(sentence, keywords) + (index === 0 ? 1.4 : 0) + (index === sentences.length - 1 ? 0.6 : 0)
    }))
    .filter((item) => item.sentence.length > 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index);

  if (scored.length === 0 && sentences[0]) return [sentences[0]];
  return scored.map((item) => item.sentence);
}

function scoreSentence(sentence, keywords) {
  const normalized = normalize(sentence);
  let score = Math.min(2, wordCount(sentence) / 35);
  for (const keyword of keywords.slice(0, 12)) {
    if (normalized.includes(normalize(keyword))) score += 1.2;
  }
  if (/[0-9%€$]/.test(sentence)) score += 0.8;
  if (/\b(donc|parce que|c'est-a-dire|c'est à dire|selon|enjeu|probleme|question|risque|politique|etat|banque|guerre|donnees)\b/i.test(sentence)) {
    score += 0.7;
  }
  return score;
}

function ideaSentence(sentence, index) {
  const cleaned = shorten(cleanSentence(sentence), 260);
  const intro = [
    "L'invité met en avant l'idée que",
    "Il relie ensuite ce point au constat suivant:",
    "Le passage fait surtout ressortir que",
    "L'argument se précise autour de cette idée:"
  ][index % 4];
  return `${intro} ${lowerFirst(cleaned)}`;
}

function closingSentence(theme, keywords, index) {
  const endings = [
    `L'intérêt de ce moment est de montrer comment ${theme} devient une question de décision, de responsabilité et de méthode.`,
    `Cette partie fixe donc une logique: partir des faits mentionnés, identifier les acteurs concernés, puis mesurer les effets possibles.`,
    `Même lorsque le sous-titrage automatique reste imparfait, le fil argumentatif demeure lisible autour de ${keywords.slice(0, 3).join(", ") || theme}.`,
    `Le passage prépare la suite de l'entretien en installant ${keywords.slice(0, 3).join(", ") || "ces thèmes"} comme points d'appui.`
  ];
  return endings[index % endings.length];
}

function buildExecutiveSummary(interview, sections, transcript, words) {
  const allKeywords = topKeywords(transcript, interview).slice(0, 10);
  const first = sections[0]?.paragraphs[0] ?? "";
  const middle = sections[Math.floor(sections.length / 2)]?.paragraphs[0] ?? "";
  const last = sections.at(-1)?.paragraphs.at(-1) ?? "";

  const paragraphOne =
    `Dans cet entretien Thinkerview, "${interview.title}", ${interview.guest} développe un propos centré sur ${themePhrase(interview.themes, allKeywords)}. Le dossier reconstruit depuis environ ${formatNumber(words)} mots de sous-titres fait apparaître plusieurs nœuds récurrents: ${joinNatural(allKeywords.slice(0, 6))}. L'entretien avance par paliers: mise en situation, clarification des rapports de force, exemples ou controverses, puis retour vers les conséquences politiques, sociales, économiques ou stratégiques.`;

  const paragraphTwo =
    `Le résumé conserve l'ordre de l'échange pour ne pas dissoudre le raisonnement dans une synthèse trop abstraite. Au début, ${lowerFirst(simplifyParagraph(first))} Au centre, ${lowerFirst(simplifyParagraph(middle))}`;

  const paragraphThree =
    `La conclusion éditoriale reste prudente: les zones confuses du sous-titrage ne sont pas complétées par des connaissances externes. La fin de l'entretien ramène toutefois le lecteur vers ${joinNatural(allKeywords.slice(4, 10)) || "les enjeux principaux"}: ${lowerFirst(simplifyParagraph(last))}`;

  return `${paragraphOne}\n\n${paragraphTwo}\n\n${paragraphThree}`;
}

function buildYouthAdvice(sections) {
  const finalText = sections
    .slice(-2)
    .flatMap((section) => section.paragraphs)
    .join(" ");
  return shorten(
    simplifyParagraph(finalText) ||
      "Conseil à préciser après une reprise éditoriale approfondie du transcript.",
    420
  );
}

function buildReadingRecommendations(sections, transcript) {
  const text = `${sections.slice(-3).map((section) => section.paragraphs.join(" ")).join(" ")} ${transcript}`;
  const recommendations = [];
  const patterns = [
    /\b(lire|lisez|lecture|recommande|conseille)\b[^.!?]{0,180}/giu,
    /\b(livre|ouvrage|rapport|sources?|code|d[ée]bats parlementaires|documents?)\b[^.!?]{0,160}/giu
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = shorten(cleanSentence(match[0]), 160);
      if (value.length > 25 && !recommendations.some((item) => item.toLowerCase() === value.toLowerCase())) {
        recommendations.push(value);
      }
      if (recommendations.length >= 4) return recommendations;
    }
  }

  return ["Sources primaires et documents cités dans l'entretien."];
}

function simplifyParagraph(paragraph) {
  return shorten(
    paragraph
      .replace(/Cette partie pose le cadre du raisonnement\. /, "")
      .replace(/Cette séquence installe le raisonnement\. /, "")
      .replace(/Le développement déplace ensuite le propos\. /, "")
      .replace(/La discussion resserre alors l'analyse\. /, "")
      .replace(/Le passage fait apparaître une tension centrale\. /, "")
      .replace(/Le fil argumentatif insiste ici sur les conséquences\. /, ""),
    520
  );
}

function buildTitle(keywords, index, interview) {
  const fallbackByTheme = {
    democratie: "Pouvoirs, responsabilités et institutions",
    economie: "Finance, dette et rapports de force",
    ecologie: "Ressources, limites et choix collectifs",
    geopolitique: "Rapports de puissance et conflictualités",
    numerique: "Données, réseaux et souveraineté",
    societe: "Société, normes et fractures collectives"
  };
  const theme = interview.themes?.[index % Math.max(1, interview.themes.length)];
  const filtered = keywords.filter((keyword) => {
    const words = keyword.split(" ");
    return words.every((word) => words.indexOf(word) === words.lastIndexOf(word));
  });
  const base = filtered.slice(0, 3).map(titleCase).join(", ");
  return base || fallbackByTheme[theme] || "Arguments, exemples et consequences";
}

function topKeywords(text, interview) {
  const counts = new Map();
  const tokens = normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));

  for (const token of tokens) {
    if (isGuestToken(token, interview)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const bigramCounts = new Map();
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const first = tokens[i];
    const second = tokens[i + 1];
    if (STOPWORDS.has(first) || STOPWORDS.has(second) || first === second) continue;
    const phrase = `${first} ${second}`;
    bigramCounts.set(phrase, (bigramCounts.get(phrase) ?? 0) + 1);
  }

  const phrases = [...bigramCounts.entries()]
    .filter(([phrase, count]) => count >= 2 && !/(^|\s)(quelque|chose|tout|monde|nous|vous|leur|leurs|vont|dire|faire|truc|exemple)(\s|$)/.test(phrase))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([phrase]) => phrase);

  const single = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([word]) => word);

  return unique([...phrases, ...single]).slice(0, 12);
}

function isGuestToken(token, interview) {
  const guestTokens = normalize(`${interview.guest} ${interview.title}`).split(/[^a-z0-9]+/);
  return guestTokens.includes(token) && token.length > 4;
}

function themePhrase(themes = [], keywords = []) {
  const labels = {
    democratie: "la démocratie, les institutions et les libertés publiques",
    economie: "l'économie, la finance et la répartition du pouvoir",
    ecologie: "l'écologie, les limites physiques et les ressources",
    geopolitique: "la géopolitique, la guerre et les rapports de puissance",
    numerique: "le numérique, les données et les infrastructures",
    societe: "la société, les normes collectives et les trajectoires individuelles"
  };
  const mapped = themes.slice(0, 2).map((theme) => labels[theme]).filter(Boolean);
  if (mapped.length) return mapped.join(" ainsi que ");
  return keywords.slice(0, 3).join(", ") || "les enjeux traites";
}

function buildMethodNote(interview, words) {
  const language = interview.transcript.language ? `, langue déclarée: ${interview.transcript.language}` : "";
  return `Résumé éditorial produit à partir du transcript local ${interview.transcript.source_file}${language}, et de l'entrée correspondante dans data/interviews.json. Le sous-titrage automatique contient environ ${formatNumber(words)} mots; le résumé suit l'ordre du texte disponible, paraphrase les idées identifiables et signale implicitement les limites liées aux passages répétitifs ou bruités.`;
}

function confidenceFor(interview, words) {
  if (!interview.transcript?.available) return 0.2;
  let confidence = 0.78;
  if (interview.transcript.language === "fr-orig") confidence += 0.04;
  if (interview.transcript.language === "en") confidence -= 0.06;
  if (words < 1000) confidence -= 0.14;
  else if (words < 4000) confidence -= 0.08;
  else if (words > 12000) confidence += 0.03;
  return Math.max(0.42, Math.min(0.86, Number(confidence.toFixed(2))));
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/c'est/g, "cest")
    .replace(/d'/g, "")
    .replace(/l'/g, "");
}

function shorten(value, max) {
  if (value.length <= max) return ensurePeriod(value);
  const trimmed = value.slice(0, max);
  const end = Math.max(trimmed.lastIndexOf("."), trimmed.lastIndexOf(";"), trimmed.lastIndexOf(","), trimmed.lastIndexOf(" "));
  return ensurePeriod(`${trimmed.slice(0, end > max * 0.65 ? end : max).trim()}...`);
}

function lowerFirst(value) {
  if (!value) return value;
  return value[0].toLowerCase() + value.slice(1);
}

function titleCase(value) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ensurePeriod(value) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinNatural(values) {
  const filtered = values.filter(Boolean);
  if (filtered.length <= 1) return filtered.join("");
  if (filtered.length === 2) return `${filtered[0]} et ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(", ")} et ${filtered.at(-1)}`;
}

function unique(values) {
  return [...new Set(values)];
}

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function wordCount(value) {
  return value.split(/\s+/).filter(Boolean).length;
}
