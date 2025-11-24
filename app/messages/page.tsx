import { getChannels } from "@/lib/odoo";
import ChatInterface from "@/components/ChatInterface";
import { Channel } from "@/lib/types";

// Mock pour la démo si Odoo n'a pas de channels configurés
const MOCK_CHANNELS: Channel[] = [];

export default async function MessagesPage() {
  let channels: Channel[] = [];

  try {
    const realChannels = await getChannels();
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