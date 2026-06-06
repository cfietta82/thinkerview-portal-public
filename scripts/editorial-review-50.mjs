import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PLAN_PATH = join(ROOT, "data/editorial-review-50.json");
const DATA_PATH = join(ROOT, "data/interviews.json");
const SUMMARY_DIR = join(ROOT, "data/editorial-summaries");
const TARGET_COUNT = 50;

const mechanicalMarkers = [
  "Le propos ne se limite pas Ã  une rÃ©action d'actualitÃ©",
  "La discussion donne ensuite du poids aux exemples",
  "Le passage reste prudent",
  "L'intÃ©rÃªt Ã©ditorial de ce passage",
  "Ukraine, Russie Et Recomposition",
  "La matiÃ¨re du transcript montre une progression par reprises successives",
  "Les exemples, mÃªme lorsqu'ils proviennent d'un transcript imparfait",
  "comme points de tension",
  "Cette partie pose le cadre",
  "L'idÃ©e formulÃ©e est que",
  "Le raisonnement avance que",
  "La nuance importante tient",
  "Le passage fonctionne comme une Ã©tape"
];

const command = process.argv[2] ?? "status";

if (command === "init") {
  initPlan(process.argv.includes("--force"));
} else if (command === "status") {
  printStatus();
} else if (command === "next") {
  printNext(Number(process.argv[3] ?? 5));
} else if (command === "validate") {
  validatePlan();
} else {
  console.error("Usage: node scripts/editorial-review-50.mjs [init|status|next|validate]");
  process.exit(1);
}

function initPlan(force) {
  if (existsSync(PLAN_PATH) && !force) {
    console.log(`plan already exists: ${relative(PLAN_PATH)}`);
    printStatus();
    return;
  }

  const data = readJson(DATA_PATH);
  const candidates = data.interviews
    .filter((interview) => interview.transcript?.source_file)
    .filter((interview) => hasMechanicalText(JSON.stringify(interview)))
    .slice(0, TARGET_COUNT);

  const plan = {
    created_at: new Date().toISOString(),
    target_count: TARGET_COUNT,
    policy: {
      source: "Use only local YouTube transcript files already present in data/transcripts. Skip or hold pages whose transcript is absent or unusable.",
      quality: "Same premium quality level as Marc Touati and Bernard Stiegler: long executive summary, editorial chronology, preserved ideas, no template prose.",
      publication: "Do not publish until all 50 queue items validate, summaries are merged, build succeeds, and production URLs are checked."
    },
    queue: candidates.map((interview, index) => ({
      order: index + 1,
      id: interview.id,
      guest: interview.guest,
      title: interview.title,
      duration_seconds: interview.duration_seconds,
      transcript: interview.transcript.source_file,
      target: "premium_rewrite",
      notes: ""
    }))
  };

  writeFileSync(PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`);
  console.log(`created ${relative(PLAN_PATH)} with ${plan.queue.length} items`);
  printStatus();
}

function printStatus() {
  const plan = readPlan();
  const rows = plan.queue.map((item) => ({ ...item, status: itemStatus(item) }));
  const counts = countBy(rows, "status");

  console.log(`Editorial review 50: ${relative(PLAN_PATH)}`);
  console.log(`target=${plan.target_count} queue=${plan.queue.length}`);
  for (const status of ["ready_unmerged", "needs_rewrite", "missing_summary", "invalid_json", "missing_transcript"]) {
    console.log(`${status}=${counts[status] ?? 0}`);
  }

  console.log("\nNext work:");
  for (const item of rows.filter((row) => row.status !== "ready_unmerged").slice(0, 10)) {
    console.log(`${String(item.order).padStart(2, "0")} ${item.id} | ${item.guest} | ${item.status}`);
  }
}

function printNext(limit) {
  const plan = readPlan();
  const rows = plan.queue.map((item) => ({ ...item, status: itemStatus(item) }));
  const next = rows.filter((row) => row.status !== "ready_unmerged").slice(0, limit);

  if (!next.length) {
    console.log("No pending items. Run validate, merge, build, then deploy.");
    return;
  }

  for (const item of next) {
    console.log(`${item.order}. ${item.id} | ${item.guest}`);
    console.log(`   title: ${item.title}`);
    console.log(`   transcript: ${item.transcript}`);
    console.log(`   inspect: node scripts\\inspect-transcript-chunks.mjs ${item.id}`);
  }
}

function validatePlan() {
  const plan = readPlan();
  const failures = [];

  for (const item of plan.queue) {
    const status = itemStatus(item);
    if (status !== "ready_unmerged") {
      failures.push(`${item.order}. ${item.id} ${status}`);
    }
  }

  if (failures.length) {
    console.log(`validate failed: ${failures.length}/${plan.queue.length} not ready`);
    for (const failure of failures) console.log(failure);
    process.exit(1);
  }

  console.log(`validate ok: ${plan.queue.length}/${plan.queue.length} premium summaries ready`);
}

function itemStatus(item) {
  if (!item.transcript || !existsSync(join(ROOT, item.transcript))) return "missing_transcript";

  const summaryPath = join(SUMMARY_DIR, `${item.id}.json`);
  if (!existsSync(summaryPath)) return "missing_summary";

  let summary;
  try {
    summary = readJson(summaryPath);
  } catch {
    return "invalid_json";
  }

  const paragraphs = Array.isArray(summary.sections)
    ? summary.sections.flatMap((section) => section.paragraphs ?? [])
    : [];
  const text = [
    summary.executive_summary,
    summary.youth_advice,
    ...(summary.reading_recommendations ?? []),
    ...(summary.sections ?? []).flatMap((section) => [section.title, ...(section.paragraphs ?? [])]),
    summary.method_note
  ].join("\n");

  if (hasMechanicalText(text)) return "needs_rewrite";
  if (typeof summary.executive_summary !== "string" || summary.executive_summary.length < 2200) return "needs_rewrite";
  if (!Array.isArray(summary.sections) || summary.sections.length < 10) return "needs_rewrite";
  if (paragraphs.length < 24) return "needs_rewrite";
  if (!Array.isArray(summary.reading_recommendations) || summary.reading_recommendations.length < 5) return "needs_rewrite";
  if (typeof summary.youth_advice !== "string" || summary.youth_advice.length < 250) return "needs_rewrite";
  if (typeof summary.method_note !== "string" || !summary.method_note.includes(item.transcript)) return "needs_rewrite";

  return "ready_unmerged";
}

function readPlan() {
  if (!existsSync(PLAN_PATH)) {
    console.error(`Missing ${relative(PLAN_PATH)}. Run: npm run editorial:50:init`);
    process.exit(1);
  }
  return readJson(PLAN_PATH);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function hasMechanicalText(text) {
  return mechanicalMarkers.some((marker) => text.includes(marker));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] ?? 0) + 1;
    return acc;
  }, {});
}

function relative(filePath) {
  return filePath.replace(`${ROOT}\\`, "").replaceAll("\\", "/");
}
