"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Globe, Phone, Mail, Building, 
  Briefcase, Wrench, ShieldCheck, ExternalLink 
} from "lucide-react";
import { Company } from "@/lib/types";

export default function CompanyDirectory({ companies }: { companies: Company[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "SUPPLIER" | "CLIENT">("ALL");

  const filtered = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "SUPPLIER") return matchesSearch && c.is_supplier;
    if (filterType === "CLIENT") return matchesSearch && c.is_customer;
    return matchesSearch;
  });

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600"/> Répertoire Entreprises
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Partenaires, fournisseurs et locataires professionnels.
          </p>
        </div>
        
        {/* Stats Rapides */}
        <div className="flex gap-4">
            <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                <p className="text-lg font-bold text-slate-800">{companies.length}</p>
            </div>
             <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl shadow-sm">
                <p className="text-xs text-orange-400 uppercase font-bold">Fournisseurs</p>
                <p className="text-lg font-bold text-orange-700">{companies.filter(c => c.is_supplier).length}</p>
            </div>
        </div>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
         {/* Search */}
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, NIF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
         </div>
         
         {/* Filter Buttons */}
         <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
            {[
                { id: "ALL", label: "Tout" },
                { id: "CLIENT", label: "Clients B2B" },
                { id: "SUPPLIER", label: "Fournisseurs" },
            ].map(f => (
                <button
                    key={f.id}
                    onClick={() => setFilterType(f.id as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        filterType === f.id 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    {f.label}
                </button>
            ))}
         </div>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
            {filtered.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- CARD COMPONENT ---
function CompanyCard({ company, index }: { company: Company, index: number }) {
  // Fallback si pas de logo : Initiale
  const initial = company.name.charAt(0).toUpperCase();

  return (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group"
    >
        <div className="flex items-start justify-between mb-4">
            {/* Logo Wrapper */}
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
                {company.image ? (
                    <img src={`data:image/png;base64,${company.image}`} alt={company.name} className="w-full h-full object-contain" />
                ) : (
                    <span className="text-2xl font-bold text-slate-300">{initial}</span>
                )}
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 items-end">
                {company.is_customer && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                        <Building size={10} /> Client
                    </span>
                )}
                {company.is_supplier && (
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                        <Wrench size={10} /> Fournisseur
                    </span>
                )}
            </div>
        </div>

        <div>
            <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{company.name}</h3>
            {company.vat && (
                <p className="text-xs text-slate-400 font-mono mb-4 flex items-center gap-1">
                    <ShieldCheck size={12}/> NIF: {company.vat}
                </p>
            )}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50">
            {company.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Mail size={14} />
                    </div>
                    <span className="truncate">{company.email}</span>
                </div>
            )}
            {company.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Phone size={14} />
                    </div>
                    <span>{company.phone}</span>
                </div>
            )}
            {company.website && (
                 <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank"
                    className="flex items-center gap-3 text-sm text-blue-600 hover:underline group/link"
                 >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 group-hover/link:bg-blue-100">
                        <Globe size={14} />
                    </div>
                    <span className="truncate flex items-center gap-1">
                        Site Web <ExternalLink size={10} />
                    </span>
                </a>
            )}
        </div>
    </motion.div>
  );
}