import { fetchOdooData } from "@/lib/odoo";
import NewSiteForm from "./SiteForm";

export default async function NewSitePage() {
  // 1. Récupération des données côté serveur (rapide et sécurisé)
  const provinces = await fetchOdooData("x_provinces", ["id", "x_name"], [], 1000);

  // 2. On passe les données au composant client
  return <NewSiteForm provinces={provinces} />;
}