import { getReportData } from "@/lib/odoo";
import ReportDashboard from "@/components/ReportDashboard";

export default async function ReportsPage() {
  const data = await getReportData();
  return <ReportDashboard data={data} />;
}