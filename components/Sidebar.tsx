"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Building2, Map as MapIcon, Users, 
  Briefcase, Calendar, MessageSquare, RefreshCw, ChevronDown, ChevronRight, 
  ClipboardList,
  Banknote,
  BarChart3,
  BookText,
  Contact,
  Gavel
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Tableau de bord", icon: LayoutDashboard, href: "/" },
  { name: "Gestion des Sites", icon: Building2, href: "/sites" }, // Match /sites et /sites/new
  { name: "Carte Interactive", icon: MapIcon, href: "/map" },
  { 
    name: "Gestion des Utilisateurs", 
    icon: Users, 
    href: "/users", // Route parente
    subItems: [
      { name: "Tous les utilisateurs", href: "/users" },
      { name: "Prospects", href: "/users?filter=prospect" },
      { name: "Locataires", href: "/users?filter=tenant" },
    ]
  },
  { name: "Entreprises", icon: Briefcase, href: "/companies" },
  { name: "Agenda", icon: Calendar, href: "/agenda" },
  { name: "Messagerie", icon: MessageSquare, href: "/messages" },
  { name: "Reprise immobilière", icon: RefreshCw, href: "/reprise" },
  { name: "Demandes et Réclamations", icon: ClipboardList, href: "/tickets" },
  { name: "Gestion Financière", icon: Banknote, href: "/finance" },
  { name: "Gestion de Recouvrement", icon: Gavel, href: "/recovery" },
  { name: "Analyse et Rapports", icon: BarChart3, href: "/reports" },
  { name: "Annuaire", icon: Contact, href: "/directory" },
  { name: "Journaux d'audits", icon: BookText, href: "/audits" },
];

export default function Sidebar() {
  const pathname = usePathname();
  // On initialise le menu ouvert en fonction de l'URL actuelle au chargement
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    // Si on est sur une page /users/..., on ouvre le menu automatiquement
    if (pathname.startsWith("/users")) {
      setOpenSubmenu("Gestion des Utilisateurs");
    }
  }, [pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 flex flex-col z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">M</div>
          Mapango
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          const hasSub = item.subItems && item.subItems.length > 0;
          
          // Logique "Is Active" améliorée :
          // 1. Si c'est le dashboard ("/") : il faut que pathname soit exactement "/"
          // 2. Sinon : si pathname commence par href (ex: /sites/new commence par /sites)
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);

          const isSubOpen = openSubmenu === item.name;

          return (
            <div key={item.name}>
              {/* ITEM PRINCIPAL */}
              <div
                onClick={() => hasSub ? toggleSubmenu(item.name) : null}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group select-none",
                  isActive && !hasSub 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {/* Si pas de sous-menu, on utilise Link. Sinon, c'est juste un bouton toggle */}
                {hasSub ? (
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon size={20} strokeWidth={1.5} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ) : (
                  <Link href={item.href} className="flex items-center gap-3 flex-1">
                    <item.icon size={20} strokeWidth={1.5} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )}

                {hasSub && (
                  <div className="text-slate-400 transition-transform duration-200">
                    {isSubOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                )}
              </div>

              {/* SOUS-MENU ANIMÉ */}
              <AnimatePresence>
                {hasSub && isSubOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-9 border-l border-slate-200 pl-3 space-y-1 mt-1"
                  >
                    {item.subItems.map((sub) => {
                        // Vérifie si le sous-lien est actif (optionnel, selon ta logique d'URL)
                        const isSubActive = pathname === sub.href; 
                        
                        return (
                          <Link 
                            key={sub.name} 
                            href={sub.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-lg transition-colors",
                              isSubActive 
                                ? "text-blue-600 bg-blue-50/50 font-medium" 
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                          >
                            {sub.name}
                          </Link>
                        );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Footer (Optionnel mais sympa) */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                AD
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">Admin Odoo</p>
                <p className="text-xs text-slate-400 truncate">admin@mapango.cd</p>
            </div>
        </div>
      </div>
    </aside>
  );
}