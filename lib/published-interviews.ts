import type { Interview, PortalData } from "@/types/portal";

const mechanicalSummaryMarkers = [
  "Le propos ne se limite pas à une réaction d'actualité",
  "La discussion donne ensuite du poids aux exemples",
  "Le passage reste prudent",
  "L'intérêt éditorial de ce passage",
  "Ukraine, Russie Et Recomposition",
  "La matière du transcript montre une progression par reprises successives",
  "Les exemples, même lorsqu'ils proviennent d'un transcript imparfait",
  "comme points de tension"
];

export function hasYoutubeTranscript(interview: Interview) {
  return Boolean(interview.transcript?.source_file);
}

export function hasEditorialQuality(interview: Interview) {
  const text = [
    interview.executive_summary,
    interview.youth_advice,
    interview.method_note,
    ...(interview.reading_recommendations ?? []),
    ...interview.sections.flatMap((section) => [section.title, ...section.paragraphs])
  ].join("\n");

  return !mechanicalSummaryMarkers.some((marker) => text.includes(marker));
}

export function publishedInterviews(data: PortalData) {
  return data.interviews.filter((interview) => hasYoutubeTranscript(interview) && hasEditorialQuality(interview));
}

export function publishedPortalData(data: PortalData): PortalData {
  return {
    ...data,
    interviews: publishedInterviews(data)
  };
}
