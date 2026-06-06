import { Portal } from "@/components/portal";
import rawData from "@/data/interviews.json";

export default function Page() {
  return <Portal data={rawData} />;
}
