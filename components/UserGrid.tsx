"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, Mail, Phone, 
  MoreHorizontal, MapPin, User, Building 
} from "lucide-react";
import { Partner } from "@/lib/odoo";

export default function UserGrid({ initialData }: { initialData: Partner[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "TENANT" | "PROSPECT">("ALL");

  // Logique de filtrage (Simulée pour l'instant si tu n'as pas de tags précis dans Odoo)
  // Dans un vrai cas, on filtrerait sur `partner.category_id` (Tags)
  const filteredUsers = initialData.filter(user => {
    // 1. Filtre Recherche
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Filtre Onglets (Simulation ici, à adapter selon tes Tags Odoo)
    // Disons qu'on affiche tout le monde pour l'instant, mais tu pourras filtrer par Tag ID
    const matchesTab = activeTab === "ALL" ? true : true; 

    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <User className="text-blue-600"/> Gestion des Utilisateurs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gérez vos locataires, prospects et propriétaires</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
            <Plus size={18} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-6 border-b border-slate-200 mb-8">
        {[
          { id: "ALL", label: "Tous les contacts" },
          { id: "TENANT", label: "Locataires" },
          { id: "PROSPECT", label: "Prospects" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* --- GRID CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <UserCard key={user.id} user={user} index={index} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

// --- SOUS-COMPOSANT : CARTE UTILISATEUR ---
function UserCard({ user, index }: { user: Partner, index: number }) {
  // Détection basique pour savoir si c'est une entreprise (souvent pas de job mais un nom)
  const isCompany = !user.job && user.image; 

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        {/* Avatar */}
        <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                {user.image ? (
                    <img 
                        src={`data:image/png;base64,${user.image}`} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        {isCompany ? <Building size={24} /> : <User size={24} />}
                    </div>
                )}
            </div>
            {/* Status Indicator (Fake online status) */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
            <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-slate-800 text-lg truncate">{user.name}</h3>
        <p className="text-sm text-slate-500 truncate">{user.job || "Client"}</p>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-6">
        {user.email && (
             <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg truncate">
                <Mail size={14} className="text-blue-500 shrink-0" />
                <span className="truncate">{user.email}</span>
            </div>
        )}
        {(user.phone || user.mobile) && (
             <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <Phone size={14} className="text-emerald-500 shrink-0" />
                <span>{user.mobile || user.phone}</span>
            </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <a 
            href={`tel:${user.mobile || user.phone}`}
            className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
            <Phone size={14} /> Appeler
        </a>
        <a 
            href={`mailto:${user.email}`}
            className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
            <Mail size={14} /> Email
        </a>
      </div>
    </motion.div>
  );
}