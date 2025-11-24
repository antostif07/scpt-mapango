import { getInvoices } from "@/lib/odoo";
import FinanceTable from "@/components/FinanceTable";
import { Invoice } from "@/lib/types";

const MOCK_INVOICES: Invoice[] = [
    { id: 1, name: "INV/2024/005", partner_name: "Jean Kabuya", date: "2024-05-01", amount: 1200, status: "posted", payment_state: "paid" },
    { id: 2, name: "INV/2024/006", partner_name: "SNELELEC", date: "2024-05-02", amount: 450, status: "posted", payment_state: "not_paid" },
    { id: 3, name: "INV/2024/007", partner_name: "Marie T.", date: "2024-05-05", amount: 800, status: "posted", payment_state: "in_payment" },
];

export default async function FinancePage() {
  let invoices: Invoice[] = [];
  try {
     const data = await getInvoices();
     invoices = data.length > 0 ? data : MOCK_INVOICES;
  } catch(e) { invoices = MOCK_INVOICES; }

  return <FinanceTable invoices={invoices} />;
}