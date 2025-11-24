"use client";

import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from "recharts";
import { Download, Calendar, Printer } from "lucide-react";
import { ReportData } from "@/lib/types";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ReportDashboard({ data }: { data: ReportData }) {
  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Rapports & Analyses</h1>
           <p className="text-slate-500 text-sm">Performance financière et opérationnelle.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                <Calendar size={16}/> 2024
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-900/10">
                <Download size={16}/> Exporter PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* CHART 1: REVENU VS DEPENSE */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
            <h3 className="font-bold text-slate-800 mb-6">Flux de Trésorerie (6 mois)</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenueByMonth}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}/>
                        <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="expense" name="Dépenses" stroke="#ef4444" strokeWidth={3} fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* CHART 2: OCCUPATION PAR ZONE */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
        >
            <h3 className="font-bold text-slate-800 mb-2">Taux d'occupation par Zone</h3>
            <div className="flex-1 relative min-h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data.occupancyByZone} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.occupancyByZone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-bold text-slate-800">85%</span>
                     <span className="text-xs text-slate-400">Moyenne</span>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.occupancyByZone.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                        {item.name}: <b>{item.value}%</b>
                    </div>
                ))}
            </div>
        </motion.div>
      </div>

      {/* TOP SITES TABLE */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
         className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Top Sites (Revenu Annuel)</h3>
             <button className="text-blue-600 text-sm hover:underline">Voir tout</button>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                      <th className="px-6 py-3">Nom du site</th>
                      <th className="px-6 py-3 text-right">Performance</th>
                      <th className="px-6 py-3 text-right">Revenu</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {data.topSites.map((site, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium text-slate-700">{site.name}</td>
                          <td className="px-6 py-4 text-right">
                              <div className="w-24 ml-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{width: `${(site.revenue / 150000) * 100}%`}}></div>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">${site.revenue.toLocaleString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </motion.div>

    </div>
  );
}