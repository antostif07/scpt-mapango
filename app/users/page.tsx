import { getPartners, Partner } from "@/lib/odoo";
import UserGrid from "@/components/UserGrid";

export default async function UsersPage() {
  let users: Partner[] = [];

  try {
    const realUsers = await getPartners();
    
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