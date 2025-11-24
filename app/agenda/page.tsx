import { getCalendarEvents, CalendarEvent } from "@/lib/odoo";
import CalendarView from "@/components/CalendarView";

// Données Mock pour que tu puisses voir le rendu tout de suite
// (Les dates sont générées dynamiquement pour toujours être autour d'aujourd'hui)
const today = new Date();
const MOCK_EVENTS: CalendarEvent[] = [];

export default async function AgendaPage() {
  let events: CalendarEvent[] = [];

  try {
    const realEvents = await getCalendarEvents();
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