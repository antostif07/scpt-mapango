import { fetchOdooData, Site } from "@/lib/odoo";
import SitesTable from "@/components/SitesTable";

// On définit l'interface EXACTE telle qu'elle sort d'Odoo
interface OdooSite {
  id: number;
  x_name: string;
  x_studio_reference_1: string;
  x_studio_ville: string;
  x_studio_province_1: any; // Souvent [id, "Nom"]
  x_studio_superficie: number;
  x_studio_revenue: number; // Vérifie si ce champ existe, sinon met 0
}

export default async function SitesPage() {
  let sites: Site[] = [];

  try {
    // 1. On récupère les champs techniques précis
    const odooData = await fetchOdooData('x_sites', [
      'x_name', 
      'x_studio_reference_1', 
      'x_studio_ville', 
      'x_studio_province_1', 
      'x_studio_superficie'
      // Ajoute 'x_studio_total_revenue' si tu l'as créé
    ]) as unknown as OdooSite[]; // On force le type pour TypeScript

    // 2. On transforme (Map) les données Odoo en données propres pour ton UI
    sites = odooData.map(item => ({
      id: item.id,
      name: item.x_name || "Sans nom",
      ref: item.x_studio_reference_1 || "",
      city: item.x_studio_ville || "",
      // Gestion propre des Many2one (Odoo renvoie [1, "Kinshasa"] ou false)
      state_id: Array.isArray(item.x_studio_province_1) ? item.x_studio_province_1 : [0, "—"],
      country_id: false, // Pas utilisé pour l'instant
      surface: item.x_studio_superficie || 0,
      total_revenue: 0 // Remplace par item.x_studio_revenue si dispo
    }));

  } catch (error) {
    console.error("ERREUR ODOO:", error);
    // En cas d'erreur, on envoie un tableau vide pour ne pas casser la page
    sites = []; 
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <SitesTable initialData={sites} />
    </div>
  );
}