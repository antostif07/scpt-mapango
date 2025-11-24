import ChatInterface from "@/components/ChatInterface";
import { fetchOdooData } from "@/lib/odoo";
import { Channel } from "@/lib/types";

// Mock pour la démo si Odoo n'a pas de channels configurés
const MOCK_CHANNELS: Channel[] = [];

export default async function MessagesPage() {
  let channels: Channel[] = [];

  try {
    const realChannels = await fetchOdooData("mail.channel", ["id", "name", "description", "image", "last_message_date"]);
    channels = realChannels.length > 0 ? realChannels : MOCK_CHANNELS;
  } catch (e) {
    channels = MOCK_CHANNELS;
  }

  return (
    <div className="w-full">
      <ChatInterface channels={channels} />
    </div>
  );
}