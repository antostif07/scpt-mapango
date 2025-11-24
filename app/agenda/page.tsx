import CalendarView from "@/components/CalendarView";
import { fetchOdooData } from "@/lib/odoo";
import { CalendarEvent } from "@/lib/types";

// Données Mock pour que tu puisses voir le rendu tout de suite
// (Les dates sont générées dynamiquement pour toujours être autour d'aujourd'hui)
const today = new Date();
const MOCK_EVENTS: CalendarEvent[] = [];

export default async function AgendaPage() {
  let events: CalendarEvent[] = [];

  try {
    const realEvents = await fetchOdooData('calendar.event', ['id', 'name', 'start', 'end', 'allday'], [], 100);
    // Fallback Mock si Odoo est vide pour la démo
    events = realEvents.length > 0 ? realEvents : MOCK_EVENTS;
  } catch (e) {
    events = MOCK_EVENTS;
  }

  return (
    <div className="w-full">
      <CalendarView events={events} />
    </div>
  );
}