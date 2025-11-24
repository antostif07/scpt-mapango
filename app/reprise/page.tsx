import { getInventories } from "@/lib/odoo";
import InventoryList from "@/components/InventoryList";
import { Inventory } from "@/lib/types";

const MOCK_DATA: Inventory[] = [
    { id: 1, name: "EDL-IN/2024/001", date: "2024-05-10T09:00:00", site_name: "Résidence Mapango A2", partner_name: "Jean Dupont", type: "incoming", state: "done" },
    { id: 2, name: "EDL-OUT/2024/045", date: "2024-05-12T14:30:00", site_name: "Villa Gombe", partner_name: "Total Energies", type: "outgoing", state: "draft" },
    { id: 3, name: "EDL-IN/2024/002", date: "2024-05-15T10:00:00", site_name: "Bureau TMB Centre", partner_name: "TMB Bank", type: "incoming", state: "confirm" },
];

export default async function ReprisePage() {
  let inventories: Inventory[] = [];

  try {
    const data = await getInventories();
    inventories = data.length > 0 ? data : MOCK_DATA;
  } catch (e) {
    inventories = MOCK_DATA;
  }

  return (
    <div className="w-full">
      <InventoryList data={inventories} />
    </div>
  );
}