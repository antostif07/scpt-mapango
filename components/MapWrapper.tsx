"use client";

import dynamic from "next/dynamic";
import { Site } from "@/lib/odoo";

// On importe le MapClient ici avec ssr: false
// Cela fonctionne car nous sommes dans un fichier "use client"
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper({ sites }: { sites: Site[] }) {
  return <MapClient sites={sites} />;
}