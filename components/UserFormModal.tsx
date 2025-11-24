"use client";

import { useState } from "react";
import { saveItemAction } from "@/app/actions/crud";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Partner } from "@/lib/types";

interface UserFormProps {
  user?: Partner; // Si vide = création
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Mapping des données pour Odoo
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      function: formData.get("job"), // 'function' est le nom technique du Job
    };

    const res = await saveItemAction(
      'res.partner', // Modèle
      payload, 
      '/users',      // Page à rafraîchir
      user?.id       // ID (si update)
    );

    if (res.success) {
      toast.success(res.message);
      onSuccess();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
        <input name="name" defaultValue={user?.name} required className="w-full p-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input name="email" type="email" defaultValue={user?.email} className="w-full p-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
        <input name="phone" defaultValue={user?.phone} className="w-full p-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Poste</label>
        <input name="job" defaultValue={user?.job} className="w-full p-2 border rounded-lg" />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18}/> {loading ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>
    </form>
  );
}