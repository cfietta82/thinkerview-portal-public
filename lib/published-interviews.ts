import type { Interview, PortalData } from "@/types/portal";

export function hasYoutubeTranscript(interview: Interview) {
  return Boolean(interview.transcript?.source_file);
}

export function publishedInterviews(data: PortalData) {
  return data.interviews.filter(hasYoutubeTranscript);
}

export function publishedPortalData(data: PortalData): PortalData {
  return {
    ...data,
    interviews: publishedInterviews(data)
  };
}
