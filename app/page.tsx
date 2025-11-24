// app/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Building, Users, Wallet, AlertCircle, 
  MoreHorizontal, Filter 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";

// --- MOCK DATA (Simulation des données Odoo) ---
const statsData = [
  { title: "Revenu Mensuel", value: "$79,832", trend: "+12.5%", trendUp: true, icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
  { title: "Sites Gérés", value: "129", sub: "4 avec locataires", icon: Building, color: "bg-blue-100 text-blue-600" },
  { title: "Espaces Occupés", value: "41", sub: "Sur 46 disponibles", icon: Users, color: "bg-violet-100 text-violet-600" },
  { title: "Impayés", value: "$1,204", trend: "-2.4%", trendUp: false, icon: AlertCircle, color: "bg-orange-100 text-orange-600" },
];

const chartData = [
  { name: 'Jan', rev: 4000, exp: 2400 },
  { name: 'Fév', rev: 3000, exp: 1398 },
  { name: 'Mar', rev: 2000, exp: 9800 },
  { name: 'Avr', rev: 2780, exp: 3908 },
  { name: 'Mai', rev: 1890, exp: 4800 },
  { name: 'Juin', rev: 2390, exp: 3800 },
  { name: 'Juil', rev: 3490, exp: 4300 },
  { name: 'Août', rev: 4490, exp: 4300 },
  { name: 'Sep', rev: 5490, exp: 5300 },
  { name: 'Oct', rev: 6490, exp: 6300 },
  { name: 'Nov', rev: 7490, exp: 7300 },
  { name: 'Déc', rev: 8490, exp: 8300 },
];

const pieData = [
  { name: 'Kinshasa', value: 400, color: '#3b82f6' },
  { name: 'Lubumbashi', value: 300, color: '#8b5cf6' },
  { name: 'Goma', value: 300, color: '#10b981' },
  { name: 'Autres', value: 200, color: '#f59e0b' },
];

// --- COMPONENTS ---

const StatCard = ({ item, index }: { item: any, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${item.color}`}>
        <item.icon size={24} />
      </div>
      {item.trend && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${item.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {item.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {item.trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{item.title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{item.value}</h3>
      {item.sub && <p className="text-slate-400 text-xs mt-1">{item.sub}</p>}
    </div>
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-slate-500 text-sm">Bienvenue sur votre espace Mapango</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter size={16}/> Filtres
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                + Nouveau Site
            </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((item, index) => (
          <StatCard key={index} item={item} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart (Revenue) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Revenu vs Dépense</h3>
            <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-lg p-2 outline-none cursor-pointer hover:bg-slate-100">
                <option>2024</option>
                <option>2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}} 
                />
                <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="exp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart (Locations) */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">Répartition par Province</h3>
            <MoreHorizontal className="text-slate-400 cursor-pointer hover:text-slate-600" size={20}/>
          </div>
          <div className="flex-1 min-h-[200px] relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             {/* Central Text Simulation */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-800">1,240</span>
                    <span className="text-xs text-slate-400">Locations</span>
                </div>
             </div>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                        <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}