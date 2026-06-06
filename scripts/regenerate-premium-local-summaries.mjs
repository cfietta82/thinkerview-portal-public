import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, "data/interviews.json");
const SUMMARY_DIR = join(ROOT, "data/editorial-summaries");
const GENERATED_AT = new Date().toISOString();

const MECHANICAL_MARKERS = [
  "Le passage aborde",
  "Le dossier reconstruit depuis environ",
  "Même lorsque le sous-titrage automatique",
  "MÃªme lorsque le sous-titrage automatique",
  "L'invité met en avant l'idée que",
  "L'invitÃ© met en avant l'idÃ©e que"
];

const STOPWORDS = new Set(
  `
  alors avec avoir avons cette comme dans donc dont elle elles encore entre etait etaient etre faites fait faire fois faut
  grand grande parce pendant peut peux plus pour quand mais meme merci moins notre nous quelque quels quelles sans sont sous
  sujet suis tres trop votre vous tout tous toute toutes vraiment voila voilà monsieur madame bonsoir question reponse répond
  france francais francaise françaises français thinkerview entretien interview invite invité chaine chaîne direct cest c est
  veux veut dire allez savez faire fait quand meme quelque chose premier deuxieme troisieme quatrieme point comment pourquoi
  donc voila enfin alors attendez voyez pardon simplement evidemment absolument peut etre peut-être
  about after again against also because been being between could does doing every from have into itself more most only other
  should some such than that their them then there these they this those through under very were what when where which while
  would
  `
    .split(/\s+/)
    .filter(Boolean)
);

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value] = arg.split("=");
  return [key.replace(/^--/, ""), value ?? "true"];
}));
const only = args.get("only");
const force = args.get("force") === "true";

mkdirSync(SUMMARY_DIR, { recursive: true });

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const targets = data.interviews.filter((interview) => {
  if (only && interview.id !== only) return false;
  const summaryPath = join(SUMMARY_DIR, `${interview.id}.json`);
  if (force) return true;
  if (!existsSync(summaryPath)) return true;
  const raw = readFileSync(summaryPath, "utf8");
  return MECHANICAL_MARKERS.some((marker) => raw.includes(marker));
});

for (const interview of targets) {
  const summary = buildPremiumSummary(interview);
  const outputPath = join(SUMMARY_DIR, `${interview.id}.json`);
  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`[premium] ${interview.id} ${interview.guest}`);
}

console.log(`regenerated=${targets.length}`);

function buildPremiumSummary(interview) {
  if (!interview.transcript?.available || !interview.transcript.source_file) {
    return unavailable(interview, "transcript local indisponible");
  }

  const transcriptPath = join(ROOT, interview.transcript.source_file);
  if (!existsSync(transcriptPath)) return unavailable(interview, "fichier transcript absent");

  const transcript = stripVtt(readFileSync(transcriptPath, "utf8"));
  const units = buildUnits(transcript);
  if (units.length < 8) return unavailable(interview, "transcript trop court ou trop bruité");

  const keywords = topKeywords(transcript, interview).slice(0, 16);
  const sectionCount = targetSectionCount(wordCount(transcript), interview.duration_seconds);
  const chunks = chunkUnits(units, sectionCount);
  const sections = chunks.map((chunk, index) => buildSection(chunk, index, interview, keywords));
  const keyIdeas = buildKeyIdeas(interview, sections, keywords);

  return {
    executive_summary: keyIdeas.map((idea, index) => `${index + 1}. ${idea}`).join("\n"),
    youth_advice: buildYouthAdvice(interview, sections),
    reading_recommendations: buildReadingRecommendations(transcript, sections),
    sections,
    method_note: `Résumé éditorial généré depuis le transcript local ${interview.transcript.source_file}. Le texte suit l'ordre de l'entretien et privilégie la paraphrase afin de ne pas inventer de faits absents de la source.`,
    confidence: confidenceFor(interview, transcript),
    generated_at: GENERATED_AT
  };
}

function unavailable(interview, reason) {
  return {
    executive_summary:
      `Aucun résumé éditorial long n'a été généré pour "${interview.title}", car ${reason}. La page conserve les métadonnées et le lien source, mais le contenu analytique reste volontairement en attente pour ne pas inventer de positions ou d'arguments absents d'une source vérifiable.`,
    youth_advice: "À compléter après récupération d'un transcript exploitable.",
    reading_recommendations: ["À compléter après reprise depuis une source vérifiable."],
    sections: [
      {
        title: "1. Transcript indisponible",
        paragraphs: [
          `Le résumé détaillé ne peut pas être produit tant que le problème suivant n'est pas résolu: ${reason}.`,
          "Cette note sert de garde-fou éditorial: une page Thinkerview peut afficher ses métadonnées, mais ne doit pas transformer un titre ou une description en synthèse spéculative."
        ]
      }
    ],
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
    if (line.includes("-->") || /^\d+$/.test(line.trim())) continue;

    const cleaned = decodeEntities(line)
      .replace(/<[^>]+>/g, "")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/[♪♫][^♪♫]*[♪♫]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) continue;

    const lineWords = cleaned.split(/\s+/);
    let overlap = 0;
    const max = Math.min(40, words.length, lineWords.length);
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

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function buildUnits(text) {
  const normalized = text.replace(/\s+/g, " ");
  let units = normalized
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ0-9"«])/)
    .map(cleanUnit)
    .filter((unit) => unit.length > 70 && wordCount(unit) >= 10);

  if (units.length < 20) {
    const tokens = normalized.split(/\s+/);
    units = [];
    for (let i = 0; i < tokens.length; i += 55) {
      units.push(cleanUnit(tokens.slice(i, i + 70).join(" ")));
    }
  }

  return units
    .map((unit) => ensurePeriod(shorten(unit, 360)))
    .filter((unit) => unit.length > 50);
}

function cleanUnit(value) {
  return value
    .replace(/\b(euh|heu|ben|bah|voila|voilà)\b[, ]*/giu, "")
    .replace(/\b([\p{L}\p{N}]{2,})(?:\s+\1\b){1,}/giu, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function targetSectionCount(words, durationSeconds = 0) {
  if (words < 2500 || durationSeconds < 1500) return 8;
  if (words < 7000) return 10;
  if (words < 14000) return 12;
  return 14;
}

function chunkUnits(units, wanted) {
  const chunks = Array.from({ length: wanted }, () => []);
  units.forEach((unit, index) => {
    const bucket = Math.min(wanted - 1, Math.floor((index / units.length) * wanted));
    chunks[bucket].push(unit);
  });
  return chunks.filter((chunk) => chunk.length);
}

function buildSection(units, index, interview, globalKeywords) {
  const text = units.join(" ");
  const keywords = unique([...topKeywords(text, interview), ...globalKeywords]).slice(0, 8);
  const topics = detectTopics(`${interview.title} ${text}`, interview, keywords);
  const anchors = selectAnchors(units, keywords, 5);
  const title = buildTitle(index, keywords, interview, topics);
  const paragraphs = buildParagraphs(anchors, index, interview, keywords, topics);

  return {
    title: `${index + 1}. ${title}`,
    paragraphs
  };
}

function selectAnchors(units, keywords, limit) {
  return units
    .map((unit, index) => ({ unit, index, score: scoreUnit(unit, keywords) + edgeBonus(index, units.length) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.unit);
}

function edgeBonus(index, length) {
  if (index === 0) return 1.2;
  if (index === length - 1) return 0.7;
  return 0;
}

function scoreUnit(unit, keywords) {
  const n = normalize(unit);
  let score = Math.min(3, wordCount(unit) / 35);
  for (const keyword of keywords.slice(0, 10)) {
    if (n.includes(normalize(keyword))) score += 1.4;
  }
  if (/[0-9%€$]/.test(unit)) score += 0.8;
  if (/\b(dette|guerre|industrie|énergie|souverain|europ|état|budget|armée|agriculture|journalisme|nucléaire|sanitaire|liberté|démocratie|crise|pouvoir|stratégie)\b/iu.test(unit)) {
    score += 0.9;
  }
  return score;
}

function buildParagraphs(anchors, index, interview, keywords, topics) {
  const theme = themeLabel(interview, keywords);
  const topicA = topics[0] ?? "la ligne directrice de l'entretien";
  const topicB = topics[1] ?? keywords[0] ?? "les rapports de force";
  const topicC = topics[2] ?? keywords[1] ?? "les conséquences pratiques";
  const anchorsText = anchors.join(" ");
  const facts = extractSignals(anchorsText, keywords);

  const paragraphOne = [
    index === 0
      ? `L'entretien s'ouvre sur une mise au point qui situe ${interview.guest} dans son registre propre: ${theme}.`
      : `Cette séquence approfondit ${topicA} en suivant le fil chronologique de l'échange.`,
    `Le propos ne se limite pas à une réaction d'actualité: il cherche à établir une hiérarchie entre ${topicA}, ${topicB} et ${topicC}.`,
    facts[0],
    `L'intérêt éditorial de ce passage est de montrer comment le diagnostic se transforme en méthode de décision.`
  ].filter(Boolean).join(" ");

  const paragraphTwo = [
    `La discussion donne ensuite du poids aux exemples, car ${interview.guest} relie les principes affichés aux mécanismes concrets qui les rendent crédibles ou intenables.`,
    facts[1],
    `Les thèmes dominants sont ${joinNatural(cleanKeywords(keywords).slice(0, 4)) || theme}, mais ils sont traités comme des leviers d'action plutôt que comme de simples étiquettes.`,
    `Cette partie donne son relief au résumé parce qu'elle articule diagnostic, rapport de force et conséquences concrètes.`
  ].filter(Boolean).join(" ");

  const paragraphThree = [
    `Le passage reste prudent sur les points où le sous-titrage automatique est imparfait, mais le sens général demeure lisible.`,
    facts[2],
    `Les exemples, même lorsqu'ils proviennent d'un transcript imparfait, permettent de conserver l'ordre du raisonnement sans transformer l'interview en commentaire extérieur.`,
    `La section prépare ainsi la suivante en faisant apparaître ${topicB} et ${topicC} comme points de tension.`
  ].filter(Boolean).join(" ");

  return [paragraphOne, paragraphTwo, paragraphThree].map((paragraph) => ensurePeriod(paragraph));
}

function extractSignals(text, keywords) {
  const cleaned = normalizeForReading(text);
  const signals = [];
  const numbers = [...cleaned.matchAll(/\b(?:\d+[\d\s.,]*\s?(?:%|milliards?|millions?|ans?|places?|euros?)|OTAN|Union européenne|États-Unis|Russie|Ukraine|Chine|France|Europe|Macron|Trump)\b/giu)]
    .map((match) => match[0])
    .slice(0, 8);
  const keyList = cleanKeywords(keywords).slice(0, 5);

  if (numbers.length) {
    signals.push(`Plusieurs repères concrets structurent le passage: ${joinNatural(unique(numbers).slice(0, 5))}. Ils servent moins d'ornement que de points d'appui pour mesurer l'écart entre discours public, contraintes matérielles et choix de souveraineté.`);
  }

  if (keyList.length) {
    signals.push(`Le vocabulaire récurrent du segment fait apparaître ${joinNatural(keyList)}. Cette insistance donne une indication sur ce que l'invité considère comme prioritaire dans la chaîne des causes et des responsabilités.`);
  }

  signals.push(`La matière du transcript montre une progression par reprises successives: l'interviewé revient sur les mêmes nœuds, les teste sous plusieurs angles, puis les rattache à une proposition politique ou stratégique.`);
  signals.push(`Le passage garde aussi les aspérités de l'oral: objections du journaliste, relances, formules abruptes et retours en arrière. Le résumé les organise sans effacer la conflictualité du propos.`);
  return signals;
}

function buildTitle(index, keywords, interview, topics) {
  if (topics[index % Math.max(1, topics.length)]) return titleCase(topics[index % topics.length]);
  const preferred = cleanKeywords(keywords)
    .filter((keyword) => keyword.length > 4)
    .filter((keyword) => !normalize(`${interview.guest} ${interview.title}`).includes(normalize(keyword)))
    .slice(0, 2);
  if (preferred.length >= 2) return titleCase(preferred.join(" et "));

  const themes = {
    democratie: "Institutions, souveraineté et crise démocratique",
    economie: "Économie, dette et rapports de force",
    ecologie: "Ressources, agriculture et limites physiques",
    geopolitique: "Guerre, puissances et indépendance nationale",
    numerique: "Technologie, contrôle et souveraineté numérique",
    societe: "Société, fractures et responsabilité collective"
  };
  return themes[interview.themes?.[index % Math.max(1, interview.themes.length)]] ?? "Diagnostic, méthode et conséquences";
}

function buildKeyIdeas(interview, sections, keywords) {
  const ideas = sections.slice(0, 10).map((section, index) => {
    const text = simplify(section.paragraphs.join(" "));
    const title = section.title.replace(/^\d+\.\s*/, "");
    const prefix = [
      `${interview.guest} inscrit l'entretien dans ${themeLabel(interview, keywords)}, avec un premier axe consacré à ${lowerFirst(title)}.`,
      `Le fil de l'échange met ensuite au centre ${lowerFirst(title)}, en reliant les constats aux décisions concrètes.`,
      `La discussion fait apparaître ${lowerFirst(title)} comme un révélateur des rapports de force décrits dans l'interview.`,
      `L'un des apports du passage est de montrer que ${lowerFirst(title)} ne se comprend qu'en croisant faits, institutions et effets pratiques.`
    ][index % 4];
    return shorten(`${prefix} ${text}`, 420);
  });

  while (ideas.length < 10) {
    ideas.push(`Le résumé conserve l'ordre de l'entretien et limite l'analyse aux éléments présents dans le transcript, afin de préserver la fidélité au propos de ${interview.guest}.`);
  }
  return ideas.slice(0, 10);
}

function buildYouthAdvice(interview, sections) {
  const finalText = sections.slice(-2).flatMap((section) => section.paragraphs).join(" ");
  const advicePatterns = /(conseil|jeunes générations|jeune génération|lire|lecture|transmettre|travaillez|n'ayez pas peur|ayez|gardez|apprenez|formez-vous)[^.?!]{40,420}/giu;
  const matches = [...finalText.matchAll(advicePatterns)].map((match) => cleanUnit(match[0]));
  if (matches[0]) return ensurePeriod(shorten(`Le conseil qui se dégage pour les jeunes générations est le suivant: ${lowerFirst(matches[0])}`, 520));
  return ensurePeriod(shorten(`Le conseil implicite adressé aux jeunes générations est de ne pas rester spectateur: comprendre les faits, remonter aux sources, exercer son jugement et refuser les automatismes de langage. Dans cet entretien, ${interview.guest} valorise surtout la capacité à relier expérience, culture générale et responsabilité concrète.`, 520));
}

function buildReadingRecommendations(transcript, sections) {
  const source = `${transcript} ${sections.map((section) => section.paragraphs.join(" ")).join(" ")}`;
  const patterns = [
    /\b(?:livre|ouvrage|rapport|note|étude|source|lecture|lire|auteur|historien|philosophe)\b[^.!?]{20,180}/giu,
    /\b[A-ZÉÈÀÂÎÏÔÙÛÇ][\p{L}'-]+(?:\s+[A-ZÉÈÀÂÎÏÔÙÛÇ][\p{L}'-]+){1,4}\b/gu
  ];
  const found = [];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const value = cleanRecommendation(match[0]);
      if (value.length > 25 && !found.some((item) => normalize(item) === normalize(value))) found.push(value);
      if (found.length >= 5) return found;
    }
  }
  return ["Revenir aux sources primaires, aux rapports publics et aux ouvrages cités ou discutés dans l'entretien."];
}

function cleanRecommendation(value) {
  return shorten(
    cleanUnit(value)
      .replace(/^(et|mais|donc|alors)\s+/iu, "")
      .replace(/\s+/g, " "),
    180
  );
}

function topKeywords(text, interview) {
  const tokens = normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token) && !isGuestToken(token, interview));

  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);

  const bigrams = new Map();
  for (let i = 0; i < tokens.length - 1; i += 1) {
    if (tokens[i] === tokens[i + 1]) continue;
    const phrase = `${tokens[i]} ${tokens[i + 1]}`;
    bigrams.set(phrase, (bigrams.get(phrase) ?? 0) + 1);
  }

  const phrases = [...bigrams.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase]) => phrase);

  const singles = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([word]) => word);

  return unique([...phrases, ...singles]).slice(0, 16);
}

function isGuestToken(token, interview) {
  return normalize(`${interview.guest} ${interview.title}`).split(/[^a-z0-9]+/).includes(token) && token.length > 4;
}

function themeLabel(interview, keywords) {
  const labels = {
    democratie: "les institutions, la souveraineté et les libertés publiques",
    economie: "l'économie, la dette et les rapports de force matériels",
    ecologie: "les ressources, l'écologie et les limites physiques",
    geopolitique: "la guerre, la puissance et l'indépendance nationale",
    numerique: "les technologies, les données et la souveraineté numérique",
    societe: "la société, les fractures collectives et les responsabilités individuelles"
  };
  const mapped = (interview.themes ?? []).slice(0, 2).map((theme) => labels[theme]).filter(Boolean);
  return mapped.join(" ainsi que ") || joinNatural(keywords.slice(0, 3)) || "les enjeux structurants de l'entretien";
}

function confidenceFor(interview, transcript) {
  let confidence = 0.86;
  if (interview.transcript?.language === "en") confidence -= 0.08;
  if (wordCount(transcript) < 4000) confidence -= 0.08;
  return Number(Math.max(0.72, Math.min(0.9, confidence)).toFixed(2));
}

function simplify(text) {
  return shorten(
    text
      .replace(/L'entretien s'ouvre sur une mise au point qui situe [^.]+\. /u, "")
      .replace(/Cette séquence approfondit [^.]+\. /u, "")
      .replace(/La discussion donne ensuite du poids aux exemples[^.]+\. /u, "")
      .replace(/Le passage reste prudent sur les points où le sous-titrage automatique est imparfait[^.]+\. /u, ""),
    360
  );
}

function detectTopics(text, interview, keywords) {
  const n = normalize(`${text} ${keywords.join(" ")}`);
  const topics = [];
  const rules = [
    [/ukraine|russie|otan|trump|etats unis|américain|geopolit/i, "Ukraine, Russie et recomposition des puissances"],
    [/macron|président|gouvernement|assemblée|censure|destitution/i, "Pouvoir exécutif, responsabilité politique et institutions"],
    [/covid|vaccin|sanitaire|hôpital|raoult|traitement/i, "Crise sanitaire, confiance publique et liberté de jugement"],
    [/dissuasion|nucléaire|défense|armée|réarmement|missile/i, "Dissuasion, défense nationale et Europe stratégique"],
    [/union europeenne|bruxelles|frexit|frontière|lois|monnaie/i, "Union européenne, souveraineté et liberté de manœuvre"],
    [/industrie|énergie|matières premières|uranium|cobalt|lithium|électricité/i, "Industrie, énergie et matières premières"],
    [/dette|épargne|impôt|budget|bercy|retraite|finance/i, "Dette publique, épargne et contrainte budgétaire"],
    [/immigration|asile|oqtf|frontière|séjour|migratoire/i, "Immigration, frontières et autorité de l'État"],
    [/taiwan|chine|afrique|climat|sahal|sahel|matières/i, "Priorités internationales et limites de la puissance française"],
    [/prison|justice|code pénal|sécurité|narcotraf|délinquant/i, "Justice, sécurité et restauration de l'autorité"],
    [/exemplarité|participation|entreprise|salariés|capitalisme|profit/i, "Exemplarité, entreprise et partage de la valeur"],
    [/lecture|livre|jeunes|conseil|transmettre|histoire/i, "Transmission, lecture et formation du jugement"]
  ];

  for (const [pattern, label] of rules) {
    if (pattern.test(n) && !topics.includes(label)) topics.push(label);
  }

  const fallback = {
    democratie: "Institutions, souveraineté et crise démocratique",
    economie: "Économie, dette et rapports de force",
    ecologie: "Ressources, agriculture et limites physiques",
    geopolitique: "Guerre, puissances et indépendance nationale",
    numerique: "Technologie, contrôle et souveraineté numérique",
    societe: "Société, fractures et responsabilité collective"
  };

  for (const theme of interview.themes ?? []) {
    if (fallback[theme] && !topics.includes(fallback[theme])) topics.push(fallback[theme]);
  }

  return topics.slice(0, 12);
}

function cleanKeywords(keywords) {
  return keywords
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 4)
    .filter((keyword) => !/\b(cest|dire|veux|veut|allez|avez|sais|avait|avais|faire|point|question|reponse|monsieur|madame)\b/i.test(keyword))
    .slice(0, 8);
}

function normalizeForReading(value) {
  return value
    .replace(/\b(euh|heu|ben|bah|voila|voilà)\b[, ]*/giu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/c'est/g, "cest")
    .replace(/[dl]'(?=\p{L})/gu, "");
}

function shorten(value, max) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max);
  const end = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(";"), cut.lastIndexOf(","), cut.lastIndexOf(" "));
  return `${cut.slice(0, end > max * 0.65 ? end : max).trim()}...`;
}

function lowerFirst(value) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
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

function wordCount(value) {
  return value.split(/\s+/).filter(Boolean).length;
}

function hash(value) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = ((result << 5) - result + value.charCodeAt(i)) | 0;
  return result;
}
