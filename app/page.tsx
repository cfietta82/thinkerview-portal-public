import { Portal } from "@/components/portal";
import rawData from "@/data/interviews.json";
import { publishedPortalData } from "@/lib/published-interviews";
import type { PortalData } from "@/types/portal";

export default function Page() {
  return <Portal data={publishedPortalData(rawData as PortalData)} />;
}
