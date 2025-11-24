import { getCompanies, } from "@/lib/odoo";
import CompanyDirectory from "@/components/CompanyDirectory";
import { Company } from "@/lib/types";

export default async function CompaniesPage() {
  let companies: Company[] = [];

  try {
    const realCompanies = await getCompanies();
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