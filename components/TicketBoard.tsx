"use client";

import { Ticket } from "@/lib/types";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal, Plus } from "lucide-react";

// Colonnes du Kanban
const COLUMNS = [
  { id: 'new', title: 'Nouvelles Demandes', color: 'bg-blue-500' },
  { id: 'progress', title: 'En cours de traitement', color: 'bg-orange-500' },
  { id: 'done', title: 'Résolu / Fermé', color: 'bg-emerald-500' },
];

export default function TicketBoard({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-50/50 overflow-x-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Demandes et Réclamations</h1>
           <p className="text-slate-500 text-sm">Suivi des interventions techniques.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
            <Plus size={18}/> Créer un ticket
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 min-w-[1000px]">
        {COLUMNS.map(col => {
            // Filtrer les tickets de la colonne (Simulation pour démo)
            // Dans la vraie vie, mapper col.id avec ticket.stage
            const colTickets = tickets.filter(t => 
                col.id === 'new' ? t.id % 3 === 0 :
                col.id === 'progress' ? t.id % 3 === 1 :
                t.id % 3 === 2
            );

            return (
                <div key={col.id} className="flex-1 flex flex-col gap-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
                        <h3 className="font-bold text-slate-700">{col.title}</h3>
                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {colTickets.length}
                        </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                        {colTickets.map((ticket, idx) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-50 text-slate-500`}>
                                        {ticket.site_name || "Général"}
                                    </span>
                                    {ticket.priority === '3' && <AlertCircle size={16} className="text-red-500"/>}
                                </div>
                                
                                <h4 className="font-bold text-slate-800 mb-1 leading-tight">{ticket.name}</h4>
                                <p className="text-xs text-slate-500 mb-3">{ticket.partner_name}</p>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock size={12}/> 2j
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={14}/>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}