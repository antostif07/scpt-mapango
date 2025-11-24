import CompanyDirectory from "@/components/CompanyDirectory";
import { fetchOdooData } from "@/lib/odoo";
import { Company } from "@/lib/types";

export default async function CompaniesPage() {
  let companies: Company[] = [];

  try {
    const realCompanies = await fetchOdooData("res.partner", [
      "id",
      "name",
      "email",
      "phone",
      "image_1920",
    ], [["is_company", "=", true]]);
    companies = realCompanies.length > 0 ? realCompanies : [];
    
  } catch (e) {
    companies = [];
  }

  return (
    <div className="w-full">
      <CompanyDirectory companies={companies} />
    </div>
  );
}