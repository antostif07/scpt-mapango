import RecoveryBoard from "@/components/RecoveryBoard";
import { fetchOdooData } from "@/lib/odoo";
import { RecoveryItem } from "@/lib/types";

// Mock Data réaliste
const MOCK_RECOVERY: RecoveryItem[] = [
    { id: 1, invoice_ref: "INV/2024/001", partner_name: "Jean Kabuya", partner_phone: "", due_date: "2024-03-01", amount_due: 1200, days_overdue: 75, level: "critical" },
    { id: 2, invoice_ref: "INV/2024/023", partner_name: "SNELELEC Sprl", partner_phone: "", due_date: "2024-04-15", amount_due: 4500, days_overdue: 32, level: "medium" },
    { id: 3, invoice_ref: "INV/2024/045", partner_name: "Marie Thérèse", partner_phone: "", due_date: "2024-05-10", amount_due: 800, days_overdue: 5, level: "low" },
    { id: 4, invoice_ref: "INV/2024/011", partner_name: "ONG Espoir", partner_phone: "", due_date: "2024-02-01", amount_due: 12000, days_overdue: 102, level: "critical" },
];

export default async function RecoveryPage() {
  let items: RecoveryItem[] = [];
  try {
     const data = await fetchOdooData("recovery.item", [
      "id",
      "invoice_ref",
      "partner_name",
      "partner_phone",
      "due_date",
      "amount_due",
      "days_overdue",
      "level"
    ], [], 100);
     items = data.length > 0 ? data : MOCK_RECOVERY;
  } catch(e) { items = MOCK_RECOVERY; }

  return <RecoveryBoard items={items} />;
}