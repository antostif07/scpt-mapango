import { getAuditLogs } from "@/lib/odoo";
import AuditLogViewer from "@/components/AuditLogViewer";
import { AuditLog } from "@/lib/types";

const MOCK_LOGS: AuditLog[] = [
    { id: 1, date: "2024-05-20T10:30:00", author: "Admin", model: "res.partner", res_name: "Jean Kabuya", body: "<p>Adresse modifiée : Kinshasa -> Lubumbashi</p>" },
    { id: 2, date: "2024-05-20T09:15:00", author: "Système", model: "account.move", res_name: "INV/2024/005", body: "<p>Facture validée automatiquement par le cron.</p>" },
    { id: 3, date: "2024-05-19T16:45:00", author: "Marie Agent", model: "helpdesk.ticket", res_name: "Fuite d'eau", body: "<p>État changé de <b>Nouveau</b> à <b>En cours</b></p>" },
];

export default async function AuditsPage() {
  let logs: AuditLog[] = [];
  try {
     const data = await getAuditLogs();
     logs = data.length > 0 ? data : MOCK_LOGS;
  } catch(e) { logs = MOCK_LOGS; }

  return <AuditLogViewer logs={logs} />;
}