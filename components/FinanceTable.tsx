"use client";

import { Invoice } from "@/lib/types";
import { motion } from "framer-motion";
import { Download, Filter, MoreHorizontal } from "lucide-react";

export default function FinanceTable({ invoices }: { invoices: Invoice[] }) {
  
  const getStatusBadge = (state: string) => {
    switch(state) {
        case 'paid': return <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">Payé</span>;
        case 'not_paid': return <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-bold">Impayé</span>;
        case 'in_payment': return <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">En traitement</span>;
        default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-bold">Brouillon</span>;
    }
  }

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Factures & Loyers</h1>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                    <Filter size={16}/> Filtrer
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                    <Download size={16}/> Export
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                        <th className="p-4">Facture</th>
                        <th className="p-4">Client / Locataire</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Montant</th>
                        <th className="p-4 text-center">État</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {invoices.map((inv, i) => (
                        <motion.tr 
                            key={inv.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors"
                        >
                            <td className="p-4 font-medium text-slate-700">{inv.name}</td>
                            <td className="p-4 text-slate-600">{inv.partner_name}</td>
                            <td className="p-4 text-slate-500">{inv.date}</td>
                            <td className="p-4 text-right font-mono font-bold text-slate-800">
                                ${inv.amount.toLocaleString()}
                            </td>
                            <td className="p-4 text-center">{getStatusBadge(inv.payment_state)}</td>
                            <td className="p-4 text-center">
                                <button className="text-slate-400 hover:text-blue-600"><MoreHorizontal size={18}/></button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}