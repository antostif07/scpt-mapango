import { fetchOdooData } from "@/lib/odoo";
import MapWrapper from "@/components/MapWrapper"; // On importe le Wrapper, pas le Client direct
import { OdooSite } from "@/lib/types";

export default async function MapPage() {
  let sites: OdooSite[] = [];

  try {
    sites = await fetchOdooData('x_sites', [
      'x_name', 
      'x_studio_reference_1', 
      'x_studio_ville', 
      'x_studio_province', 
      'x_studio_superficie',
      'x_studio_latitude_1',
      'x_studio_longitude_1',
      'x_avatar_image'
    ]) as unknown as OdooSite[];

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