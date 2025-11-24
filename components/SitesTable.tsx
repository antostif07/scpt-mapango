"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, MoreVertical, Plus, Filter, Building2 } from "lucide-react";
import { Site } from "@/lib/odoo";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SitesTable({ initialData }: { initialData: Site[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); 

  // Filtrage simple côté client pour la fluidité immédiate
  const filteredSites = initialData.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    false
  );

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-blue-600"/> Gestion des Sites
          </h1>
          <p className="text-slate-500 text-sm mt-1">{initialData.length} sites immobiliers enregistrés</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, réf..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter size={20} />
          </button>
          <Link href="/sites/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
                <Plus size={18} />
                <span>Nouveau Site</span>
            </button>
            </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="p-4 pl-6">ID & Réf</th>
                <th className="p-4">Nom du Site</th>
                <th className="p-4">Localisation</th>
                <th className="p-4 text-right">Superficie (m²)</th>
                <th className="p-4 text-right">Revenu ($)</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSites.length > 0 ? (
                filteredSites.map((site, index) => (
                  <motion.tr 
                    key={site.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/sites/${site.id}`)}
                    className="group hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-none cursor-pointer"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-mono text-xs text-slate-400">#{site.id}</div>
                      <div className="font-medium text-slate-700">{site.ref || "—"}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar / Image Placeholder */}
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Building2 size={20}/>
                        </div>
                        <span className="font-semibold text-slate-800">{site.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700">{site.city || "N/A"}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                           <MapPin size={12}/>
                           {/* Odoo retourne souvent [id, "Nom"] pour les relations, on prend l'index 1 */}
                           {Array.isArray(site.state_id) ? site.state_id[1] : "—"}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right font-mono text-slate-600">
                      {site.surface ? site.surface.toLocaleString() : "—"}
                    </td>

                    <td className="p-4 text-right">
                       {site.total_revenue ? (
                         <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs">
                           ${site.total_revenue.toLocaleString()}
                         </span>
                       ) : (
                         <span className="text-slate-400 text-xs">—</span>
                       )}
                    </td>

                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Aucun site trouvé pour "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination simple */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
           <span>Affichage de 1 à {filteredSites.length} sur {filteredSites.length}</span>
           <div className="flex gap-2">
             <button disabled className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Précédent</button>
             <button disabled className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Suivant</button>
           </div>
        </div>
      </div>
    </div>
  );
}