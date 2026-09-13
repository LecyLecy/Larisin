import { ReportsView } from "@/components/reports-view";
import { getReportOverview } from "@/lib/api";

const allowedPeriods = new Set([7, 30, 90]);

export default async function ReportsPage({
  searchParams
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParameter } = await searchParams;
  const parsedDays = Number(daysParameter);
  const days = allowedPeriods.has(parsedDays) ? parsedDays : 30;
  const report = await getReportOverview(days);

  return <ReportsView report={report.data} dataSource={report.source} days={days} />;
}
