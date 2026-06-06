import type { Interview } from "@/types/portal";

export const themeLabels: Record<string, string> = {
  democratie: "Démocratie",
  economie: "Économie",
  ecologie: "Écologie",
  geopolitique: "Géopolitique",
  numerique: "Numérique",
  societe: "Société"
};

const stopwords = new Set("alors aussi avec avoir cette comme dans donc elle elles entre être faire faut il ils leur mais nous pour plus quand que qui quoi sans sont tout très vous aux ces des du une les est par sur ses son sa se ce ne pas".split(" "));

export function interviewYear(interview: Interview) {
  const match = (interview.publish_date ?? "").match(/\d{4}/);
  return match?.[0] ?? "Date à préciser";
}

export function corpusMetrics(interviews: Interview[]) {
  return {
    interviews: interviews.length,
    hours: Math.round(interviews.reduce((acc, interview) => acc + interview.duration_seconds, 0) / 3600),
    transcripts: interviews.filter((interview) => interview.transcript.available).length,
    recommendations: interviews.reduce((acc, interview) => acc + (interview.reading_recommendations?.length ?? 0), 0)
  };
}

export function adviceWordCloud(interviews: Interview[]) {
  const counts = new Map<string, number>();
  for (const interview of interviews) {
    const words = (interview.youth_advice ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4 && !stopwords.has(word));
    for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([word, count]) => ({ word, count }));
}

export function readingRecommendations(interviews: Interview[]) {
  return interviews.flatMap((interview) =>
    (interview.reading_recommendations ?? []).map((recommendation) => ({
      recommendation,
      guest: interview.guest,
      title: interview.title,
      slug: interview.slug,
      year: interviewYear(interview)
    }))
  );
}

export function themeEvolution(interviews: Interview[]) {
  const years = [...new Set(interviews.map(interviewYear).filter((year) => year !== "Date à préciser"))].sort();
  const themes = [...new Set(interviews.flatMap((interview) => interview.themes))].sort();
  return { years, themes, rows: years.map((year) => ({ year, values: themes.map((theme) => interviews.filter((interview) => interviewYear(interview) === year && interview.themes.includes(theme)).length) })) };
}

export function politicalOrientation(interview: Interview) {
  const text = `${interview.guest} ${interview.title} ${interview.role}`.toLowerCase();
  if (/mélenchon|ruffin|roussel|montebourg|poulin|branco/.test(text)) return "Gauche / souveraineté sociale";
  if (/bellamy|knafo|zemmour|messih|le pen|bardella|wauquiez|retailleau/.test(text)) return "Droite / conservateur";
  if (/macron|armand|pannier-runacher|hollande|valls/.test(text)) return "Centre / gouvernement";
  if (/polony|jancovici|juillet|montbrial|del valle/.test(text)) return "Analyse souverainiste";
  return "Non renseignée";
}

export function orientationEvolution(interviews: Interview[]) {
  const years = [...new Set(interviews.map(interviewYear).filter((year) => year !== "Date à préciser"))].sort();
  const labels = ["Gauche / souveraineté sociale", "Droite / conservateur", "Centre / gouvernement", "Analyse souverainiste", "Non renseignée"];
  return { years, labels, rows: years.map((year) => ({ year, values: labels.map((label) => interviews.filter((interview) => interviewYear(interview) === year && politicalOrientation(interview) === label).length) })) };
}
