import { getSiteById } from "@/lib/odoo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Ruler, Wallet, Users, 
  FileText, Wrench, MoreVertical, Edit, Trash 
} from "lucide-react";
import MapWrapper from "@/components/MapWrapper"; // On réutilise notre carte !
import SiteTabs from "./SitesTabs";

// Composant Client pour les onglets (pour garder la page principale en Server Component)

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const siteId = parseInt((await params).id);
  const site = await getSiteById(siteId);

  if (!site) {
    return notFound(); // Affiche la page 404 de Next.js
  }

  // Conversion de l'image Base64 pour l'affichage
  const bgImage = (site as any).image 
    ? `data:image/png;base64,${(site as any).image}`
    : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"; // Image par défaut jolie

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900 group">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img src={bgImage} alt={site.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <Link 
                    href="/sites" 
                    className="flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-md transition-all text-sm font-medium"
                >
                    <ArrowLeft size={16} /> Retour
                </Link>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
                        <Edit size={18} />
                    </button>
                    <button className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all">
                        <Trash size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-600/90 rounded-md text-xs font-bold uppercase tracking-wide">Actif</span>
                    <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-medium backdrop-blur-md border border-white/10">
                        {site.ref || "Sans Référence"}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{site.name}</h1>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                    <span className="flex items-center gap-1"><MapPin size={16}/> {site.city}</span>
                    <span className="flex items-center gap-1"><Ruler size={16}/> {site.surface} m²</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Revenu Total" value="$0" icon={Wallet} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="Unités / Portes" value="12" icon={Users} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="Taux d'occupation" value="85%" icon={Users} color="text-violet-600" bg="bg-violet-50" />
            <StatCard label="Maintenance" value="0 Alertes" icon={Wrench} color="text-orange-600" bg="bg-orange-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: TABS & DETAILS */}
            <div className="lg:col-span-2 space-y-8">
                {/* On passe les données au composant client des onglets */}
                <SiteTabs site={site} />
            </div>

            {/* RIGHT COLUMN: MAP & INFO */}
            <div className="space-y-6">
                
                {/* Mini Map Widget */}
                <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-64 relative">
                    {/* On réutilise MapWrapper mais on force un seul site */}
                    <div className="absolute inset-0 z-0">
                         {/* Petit hack: MapWrapper attend un array */}
                        <MapWrapper sites={[site]} /> 
                    </div>
                    {/* Overlay pour empêcher le scroll intempestif si on veut */}
                    <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold shadow-sm z-10 pointer-events-none">
                        Localisation
                    </div>
                </div>

                {/* Supervisor Widget */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Superviseur</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users className="text-slate-400" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700">Jean Kabuya</p>
                            <p className="text-xs text-slate-500">Agent Immobilier</p>
                        </div>
                        <button className="ml-auto p-2 hover:bg-slate-50 rounded-full text-blue-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Appeler</button>
                        <button className="flex-1 py-2 text-xs font-medium bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Message</button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// Petit composant UI pour les stats
function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    )
}