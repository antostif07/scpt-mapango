"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Phone, Mail, Clock, Gavel, 
  Filter, CheckCircle2, MoreHorizontal 
} from "lucide-react";
import { RecoveryItem } from "@/lib/types";

export default function RecoveryBoard({ items }: { items: RecoveryItem[] }) {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "MEDIUM">("ALL");

  // Filtrage
  const filteredItems = items.filter(item => {
    if (filter === "CRITICAL") return item.level === "critical";
    if (filter === "MEDIUM") return item.level === "medium";
    return true;
  });

  // Calculs Totaux
  const totalDue = items.reduce((acc, curr) => acc + curr.amount_due, 0);
  const criticalCount = items.filter(i => i.level === "critical").length;

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* HEADER & KPI */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Gavel className="text-red-600"/> Gestion de Recouvrement
           </h1>
           <p className="text-slate-500 text-sm mt-1">Suivi des impayés et relances locataires.</p>
        </div>
        
        <div className="flex gap-4">
             <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Impayé</p>
                <p className="text-2xl font-bold text-slate-900">${totalDue.toLocaleString()}</p>
             </div>
             <div className="px-5 py-3 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                <p className="text-xs text-red-400 uppercase font-bold mb-1">Dossiers Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
             </div>
        </div>
      </div>

      {/* FILTRES ONGLETS */}
      <div className="flex items-center gap-4 mb-6">
        {[
            { id: "ALL", label: "Tous les dossiers", count: items.length },
            { id: "MEDIUM", label: "Retards (> 30j)", count: items.filter(i => i.level === 'medium').length },
            { id: "CRITICAL", label: "Contentieux (> 60j)", count: items.filter(i => i.level === 'critical').length },
        ].map(f => (
            <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f.id 
                    ? "bg-slate-800 text-white shadow-md" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
            >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === f.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {f.count}
                </span>
            </button>
        ))}
      </div>

      {/* LISTE DES IMPAYÉS */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
                <RecoveryCard key={item.id} item={item} index={index} />
            ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-200"/>
                <p>Aucun dossier trouvé dans cette catégorie.</p>
            </div>
        )}
      </div>

    </div>
  );
}

// --- CARD INDIVIDUELLE ---
function RecoveryCard({ item, index }: { item: RecoveryItem, index: number }) {
  // Styles dynamiques selon l'urgence
  const styles = {
    low: { border: "border-l-blue-400", badge: "bg-blue-50 text-blue-600", icon: Clock },
    medium: { border: "border-l-orange-400", badge: "bg-orange-50 text-orange-600", icon: AlertTriangle },
    critical: { border: "border-l-red-500", badge: "bg-red-50 text-red-600", icon: AlertTriangle },
  };
  
  const currentStyle = styles[item.level];
  const Icon = currentStyle.icon;

  return (
    <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-white rounded-xl shadow-sm border border-slate-100 border-l-[6px] ${currentStyle.border} p-5 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-all`}
    >
        {/* Info Client */}
        <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-slate-800 text-lg">{item.partner_name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${currentStyle.badge}`}>
                    <Icon size={12} /> {item.days_overdue} jours de retard
                </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
                Facture: <span className="font-mono text-slate-700">{item.invoice_ref}</span> • 
                Échéance: {item.due_date}
            </p>
        </div>

        {/* Montant */}
        <div className="text-right w-full md:w-auto">
            <p className="text-xs text-slate-400 uppercase font-bold">Reste à payer</p>
            <p className="text-2xl font-bold text-slate-900">${item.amount_due.toLocaleString()}</p>
        </div>

        {/* Actions de Relance */}
        <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
            <button className="p-2.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Appeler">
                <Phone size={18} />
            </button>
            <button className="p-2.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Envoyer email">
                <Mail size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Relancer
            </button>
             <button className="p-2.5 rounded-lg text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
            </button>
        </div>

    </motion.div>
  );
}