import UserGrid from "@/components/UserGrid";
import { fetchOdooData } from "@/lib/odoo";
import { Partner } from "@/lib/types";

export default async function UsersPage() {
  let users: Partner[] = [];

  try {
    const realUsers = await fetchOdooData("res.partner", ["id", "name", "email"], [["is_company", "=", false]], 50) as Partner[];
    
    // Si Odoo est vide (peu probable), on met le mock, sinon on prend les vrais
    users = realUsers.length > 0 ? realUsers : [];
  } catch (e) {
    users = [];
  }

  return (
    <div className="w-full">
      <UserGrid initialData={users} />
    </div>
  );
}