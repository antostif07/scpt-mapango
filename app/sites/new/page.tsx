import { getProvinces } from "@/lib/odoo";
import NewSiteForm from "./SiteForm";

export default async function NewSitePage() {
  // 1. Récupération des données côté serveur (rapide et sécurisé)
  const provinces = await getProvinces();

  // 2. On passe les données au composant client
  return <NewSiteForm provinces={provinces} />;
}