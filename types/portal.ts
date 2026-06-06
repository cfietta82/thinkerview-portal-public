export type Topic = { topic: string; confidence?: number; evidence?: string[] };

export type SummarySection = {
  title: string;
  paragraphs: string[];
};

export type PoliticalOrientation = "gauche" | "centre" | "droite" | "non politique" | "non renseigné";

export type Interview = {
  id: string;
  slug: string;
  title: string;
  guest: string;
  role: string;
  themes: string[];
  political_orientation?: PoliticalOrientation;
  publish_date?: string | null;
  duration: string;
  duration_seconds: number;
  url: string;
  thumbnail: string;
  transcript: {
    available: boolean;
    language?: string | null;
    words: number;
    source_file?: string | null;
  };
  executive_summary?: string;
  executive_points?: string[];
  youth_advice?: string;
  reading_recommendations?: string[];
  sections: SummarySection[];
  method_note: string;
  confidence: number;
};

export type PortalData = {
  generated_at: string;
  source_url: string;
  schema_version: string;
  method: string;
  channel?: { name?: string; id?: string };
  interviews: Interview[];
};
