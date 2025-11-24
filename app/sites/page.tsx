import { fetchOdooData } from "@/lib/odoo";
import SitesTable from "@/components/SitesTable";
import { OdooSite } from "@/lib/types";

export default async function SitesPage() {
  let sites: OdooSite[] = [];

  try {
    // 1. On récupère les champs techniques précis
    sites = await fetchOdooData('x_sites', [
      'x_name', 
      'x_studio_reference_1', 
      'x_studio_ville', 
      'x_studio_province_1', 
      'x_studio_superficie'
      // Ajoute 'x_studio_total_revenue' si tu l'as créé
    ]) as unknown as OdooSite[]; // On force le type pour TypeScript
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