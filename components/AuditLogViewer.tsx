"use client";
import { AuditLog } from "@/lib/types";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ShieldAlert, UserCog, Clock, FileCode } from "lucide-react";

export default function AuditLogViewer({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="p-8 w-full max-w-[1200px] mx-auto min-h-screen bg-slate-50/50">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-slate-800"/> Journaux d'audits
        </h1>
        <p className="text-slate-500 text-sm">Traçabilité des actions système et utilisateurs.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Fake Terminal Header */}
        <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-slate-400 text-xs font-mono">system.log — read-only</div>
        </div>

        {/* Timeline List */}
        <div className="p-0">
            {logs.map((log, i) => (
                <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="group flex gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                    {/* Time Column */}
                    <div className="w-32 pt-1 flex flex-col items-end text-right shrink-0">
                        <span className="text-xs font-bold text-slate-700">
                            {format(new Date(log.date), "dd MMM", { locale: fr })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                            {format(new Date(log.date), "HH:mm:ss")}
                        </span>
                    </div>

                    {/* Timeline Line */}
                    <div className="relative flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors z-10 mt-1.5"></div>
                        <div className="w-px h-full bg-slate-100 absolute top-2"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                <UserCog size={10}/> {log.author}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                                <FileCode size={10}/> {log.model}
                            </span>
                        </div>
                        
                        <p className="text-sm font-semibold text-slate-800">
                            {log.res_name}
                        </p>
                        
                        {/* HTML Body Cleaned */}
                        <div 
                            className="text-xs text-slate-500 mt-1 prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0"
                            dangerouslySetInnerHTML={{ __html: log.body }}
                        />
                    </div>
                </motion.div>
            ))}
            
            {logs.length === 0 && (
                <div className="p-10 text-center text-slate-400 italic">
                    Aucune activité récente détectée.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}