"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UserCheck, Banknote } from "lucide-react";

export default function SiteTabs({ site }: { site: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100">
        {[
            { id: "overview", label: "Vue d'ensemble", icon: FileText },
            { id: "tenants", label: "Locataires", icon: UserCheck },
            { id: "finance", label: "Comptabilité", icon: Banknote },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 relative transition-colors ${
              activeTab === tab.id ? "text-blue-600 bg-blue-50/10" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
            
            {activeTab === "overview" && (
                <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                >
                    <h3 className="font-bold text-slate-800 text-lg">Description</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Ce site immobilier est situé au cœur de {site.city}. D'une superficie totale de {site.surface} m², 
                        il offre un potentiel locatif important.
                        {/* Texte de remplissage (Lorem ipsum amélioré) */}
                        <br/><br/>
                        La gestion est actuellement assurée par l'équipe Mapango. 
                        Les installations comprennent un parking sécurisé, un groupe électrogène de secours et une maintenance 24/7.
                    </p>

                    <h3 className="font-bold text-slate-800 text-lg mt-8">Caractéristiques</h3>
                    <ul className="grid grid-cols-2 gap-3">
                        <li className="flex items-center gap-2 text-slate-600 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Groupe Électrogène</li>
                        <li className="flex items-center gap-2 text-slate-600 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Parking (20 places)</li>
                        <li className="flex items-center gap-2 text-slate-600 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Sécurité 24/7</li>
                        <li className="flex items-center gap-2 text-slate-600 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Eau courante + Forage</li>
                    </ul>
                </motion.div>
            )}

            {activeTab === "tenants" && (
                <motion.div 
                    key="tenants"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <UserCheck size={48} className="mb-4 opacity-50"/>
                        <p>Liste des locataires en cours de développement...</p>
                        <button className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                            + Ajouter un locataire
                        </button>
                    </div>
                </motion.div>
            )}

            {activeTab === "finance" && (
                 <motion.div 
                    key="finance"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                     <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Banknote size={48} className="mb-4 opacity-50"/>
                        <p>Tableau financier connecté à Odoo Accounting...</p>
                    </div>
                </motion.div>
            )}

        </AnimatePresence>
      </div>
    </div>
  );
}