import { getTickets } from "@/lib/odoo";
import TicketBoard from "@/components/TicketBoard";
import { Ticket } from "@/lib/types";

// Mock Data
const MOCK_TICKETS: Ticket[] = [
    { id: 1, name: "Fuite d'eau Cuisine", partner_name: "Jean Kabuya", site_name: "Apt A2", stage: "new", priority: "3", description: "", create_date: "" },
    { id: 2, name: "Internet Coupé", partner_name: "Equity Bank", site_name: "Siège Gombe", stage: "progress", priority: "2", description: "", create_date: "" },
    { id: 3, name: "Remplacement ampoules", partner_name: "Marie T.", site_name: "Villa 4", stage: "done", priority: "1", description: "", create_date: "" },
];

export default async function TicketsPage() {
  let tickets: Ticket[] = [];
  try {
     const data = await getTickets();
     tickets = data.length > 0 ? data : MOCK_TICKETS;
  } catch(e) { tickets = MOCK_TICKETS; }

  return <TicketBoard tickets={tickets} />;
}