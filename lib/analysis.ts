import type { Interview } from "@/types/portal";

export const themeLabels: Record<string, string> = {
  agriculture: "Agriculture",
  culture: "Culture",
  democratie: "Démocratie",
  ecologie: "Écologie",
  economie: "Économie",
  education: "Éducation",
  energie: "Énergie",
  geopolitique: "Géopolitique",
  immigration: "Immigration",
  industrie: "Industrie",
  justice: "Justice",
  medias: "Médias",
  numerique: "Numérique",
  "outre-mer": "Outre-mer",
  politique: "Politique",
  sante: "Santé",
  securite: "Sécurité",
  societe: "Société"
};

export const orientationLabels: Record<string, string> = {
  gauche: "Gauche",
  centre: "Centre",
  droite: "Droite",
  "non politique": "Non politique",
  "non renseigné": "Non renseigné"
};

const stopwords = new Set("alors aussi avec avoir cette comme dans donc elle elles entre être faire faut il ils leur mais nous pour plus quand que qui quoi sans sont tout très vous aux ces des une les est par sur ses son sa non pas".split(" "));

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
    const words = (interview.youth_advice ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((word) => word.length > 4 && !stopwords.has(word));
    for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 80).map(([word, count]) => ({ word, count }));
}

export function recommendationType(recommendation: string) {
  const text = recommendation.toLowerCase();
  if (/rapport|documents?|données|statistiques|publics?|parlementaire|commission|cour des comptes|aIE|rte|arcom|insee/.test(text)) return "Rapports et données";
  if (/documentaire|film|conférences?|podcast|émission|interview|chaîne|videos?|vidéos?/.test(text)) return "Médias et documentaires";
  if (/travaux|recherches?|études?|analyses?|ressources|publications|ouvrages?/.test(text)) return "Recherche et essais";
  if (/de |, |: /.test(recommendation) && !/rapport|travaux|analyses|ressources/i.test(recommendation)) return "Livres et auteurs";
  return "Sources à explorer";
}

export function readingRecommendations(interviews: Interview[]) {
  return interviews.flatMap((interview) =>
    (interview.reading_recommendations ?? []).map((recommendation) => ({
      recommendation,
      type: recommendationType(recommendation),
      guest: interview.guest,
      title: interview.title,
      slug: interview.slug,
      year: interviewYear(interview),
      themes: interview.themes
    }))
  );
}

export function themeEvolution(interviews: Interview[]) {
  const years = [...new Set(interviews.map(interviewYear).filter((year) => year !== "Date à préciser"))].sort();
  const themes = [...new Set(interviews.flatMap((interview) => interview.themes))].sort();
  return { years, themes, rows: years.map((year) => ({ year, values: themes.map((theme) => interviews.filter((interview) => interviewYear(interview) === year && interview.themes.includes(theme)).length) })) };
}

export function politicalOrientation(interview: Interview) {
  return interview.political_orientation ?? "non renseigné";
}

export function orientationEvolution(interviews: Interview[]) {
  const years = [...new Set(interviews.map(interviewYear).filter((year) => year !== "Date à préciser"))].sort();
  const labels = ["gauche", "centre", "droite", "non politique", "non renseigné"];
  return { years, labels, rows: years.map((year) => ({ year, values: labels.map((label) => interviews.filter((interview) => interviewYear(interview) === year && politicalOrientation(interview) === label).length) })) };
}

export function topThemes(interviews: Interview[]) {
  const counts = new Map<string, number>();
  for (const interview of interviews) for (const theme of interview.themes) counts.set(theme, (counts.get(theme) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
