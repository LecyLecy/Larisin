import { InsightView } from "@/components/insight-view";
import { getSummary } from "@/lib/api";

export default async function InsightPage() {
  const summary = await getSummary();
  return <InsightView summary={summary.data} dataSource={summary.source} />;
}
