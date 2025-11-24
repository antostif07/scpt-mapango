"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Calendar, FileCheck, 
  Download, Plus, Search, MapPin, User, Clock 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Inventory } from "@/lib/types";

export default function InventoryList({ data }: { data: Inventory[] }) {
  const [filter, setFilter] = useState<"ALL" | "IN" | "OUT">("ALL");

  const filteredData = data.filter(item => {
    if (filter === "IN") return item.type === "incoming";
    if (filter === "OUT") return item.type === "outgoing";
    return true;
  });

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="text-blue-600"/> Reprise Immobilière
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestion des états des lieux d'entrée et de sortie.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
            <Plus size={18} /> Nouvel État des lieux
        </button>
      </div>

      {/* FILTRES */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
         {[
             { id: "ALL", label: "Tout voir" },
             { id: "IN", label: "Entrées (Check-in)" },
             { id: "OUT", label: "Sorties (Check-out)" },
         ].map(f => (
             <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    filter === f.id 
                    ? "bg-slate-800 text-white border-slate-800" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
             >
                 {f.label}
             </button>
         ))}
      </div>

      {/* LISTE CARD STYLE */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
                <InventoryCard key={item.id} item={item} index={index} />
            ))
        ) : (
            <div className="text-center py-20 text-slate-400">
                Aucun état des lieux trouvé.
            </div>
        )}
      </div>
    </div>
  );
}

// --- CARD COMPONENT ---
function InventoryCard({ item, index }: { item: Inventory, index: number }) {
  const isIncoming = item.type === "incoming";
  const dateObj = new Date(item.date);

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-0 overflow-hidden flex flex-col md:flex-row"
    >
        {/* Left Color Strip Indicator */}
        <div className={`w-full md:w-2 ${isIncoming ? "bg-emerald-500" : "bg-orange-500"}`} />

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isIncoming ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
            }`}>
                {isIncoming ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
            </div>

            {/* Info Main */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                
                {/* Column 1: Ref & Type */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            item.state === 'done' ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-600"
                        }`}>
                            {item.state === 'done' ? "Signé" : "Brouillon"}
                        </span>
                    </div>
                    <p className={`text-sm font-medium ${isIncoming ? "text-emerald-600" : "text-orange-600"}`}>
                        {isIncoming ? "Entrée Locataire" : "Sortie Locataire"}
                    </p>
                </div>

                {/* Column 2: Site & Tenant */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400"/>
                        <span className="truncate">{item.site_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User size={14} className="text-slate-400"/>
                        <span className="truncate">{item.partner_name}</span>
                    </div>
                </div>

                {/* Column 3: Date */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={16} />
                    <div>
                        <p className="font-medium text-slate-700 capitalize">
                            {format(dateObj, "dd MMMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-xs text-slate-400">
                            {format(dateObj, "HH:mm")}
                        </p>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 md:pt-0 w-full md:w-auto border-t md:border-t-0 border-slate-100">
                <button className="flex-1 md:flex-none p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                    <Download size={20} />
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                    Détails
                </button>
            </div>

        </div>
    </motion.div>
  );
}