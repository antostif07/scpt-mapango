import { fetchOdooData, Site } from "@/lib/odoo";
import MapWrapper from "@/components/MapWrapper"; // On importe le Wrapper, pas le Client direct

interface OdooSite {
  id: number;
  x_name: string;
  x_studio_reference_1: string;
  x_studio_ville: string;
  x_studio_province: any; 
  x_studio_superficie: number;
  x_studio_latitude_1: string;
  x_studio_longitude_1: string;
}

export default async function MapPage() {
  let sites: Site[] = [];

  try {
    const odooData = await fetchOdooData('x_sites', [
      'x_name', 
      'x_studio_reference_1', 
      'x_studio_ville', 
      'x_studio_province', 
      'x_studio_superficie',
      'x_studio_latitude_1',
      'x_studio_longitude_1'
    ]) as unknown as OdooSite[];

    sites = odooData.map(item => ({
      id: item.id,
      name: item.x_name || "Sans nom",
      ref: item.x_studio_reference_1 || "",
      city: item.x_studio_ville || "",
      state_id: Array.isArray(item.x_studio_province) ? item.x_studio_province : [0, ""],
      country_id: false,
      surface: item.x_studio_superficie || 0,
      total_revenue: 0,
      latitude: item.x_studio_latitude_1,
      longitude: item.x_studio_longitude_1
    }));

  } catch (error) {
    console.error("ERREUR MAP:", error);
    sites = [];
  }

  return (
    <div className="w-full h-full">
      <MapWrapper sites={sites} />
    </div>
  );
}