import { getSummary } from "@/lib/api";
import { DashboardView } from "@/components/dashboard-view";

export default async function DashboardPage() {
  const { data, source } = await getSummary();

  return <DashboardView summary={data} dataSource={source} />;
}
