"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { OdooSite } from "@/lib/types";

// --- 1. Icône Custom (inchangée) ---
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <div class="relative inline-flex rounded-full h-8 w-8 bg-blue-600 border-2 border-white shadow-lg items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8H7v8"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// --- 2. NOUVEAU COMPOSANT : AUTO-ZOOM ---
function FitBounds({ sites }: { sites: OdooSite[] }) {
  const map = useMap();

  useEffect(() => {
    if (sites.length === 0) return;

    // On crée un tableau de coordonnées [lat, lng]
    const markers = sites.map(s => [parseFloat(s.x_studio_latitude_1!), parseFloat(s.x_studio_longitude_1!)]);

    // On crée une "Bound" (limite) Leaflet qui englobe tous ces points
    const bounds = L.latLngBounds(markers as L.LatLngExpression[]);

    // On dit à la carte de s'adapter à cette limite avec une marge (padding)
    map.fitBounds(bounds, { 
      padding: [50, 50], // Marge de 50px autour des points
      maxZoom: 15 // Pour ne pas zoomer trop près s'il n'y a qu'un seul point
    });
  }, [sites, map]);

  return null;
}

export default function MapClient({ sites }: { sites: OdooSite[] }) {
  // Centre par défaut (Repli si aucun site)
  const defaultCenter: [number, number] = [-4.325, 15.322]; 
  const [selectedSite, setSelectedSite] = useState<OdooSite | null>(null);

  // Filtrage des sites valides
  const validSites = sites.filter(s => 
    s.x_studio_latitude_1 && s.x_studio_longitude_1 && 
    !isNaN(parseFloat(s.x_studio_latitude_1)) && 
    !isNaN(parseFloat(s.x_studio_longitude_1))
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
      
      <MapContainer 
        center={defaultCenter} 
        zoom={6} // Zoom dézoomé par défaut
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* --- L'APPEL MAGIQUE --- */}
        {/* Ce composant va recentrer la caméra automatiquement */}
        {validSites.length > 0 && <FitBounds sites={validSites} />}

        {validSites.map((site) => (
            <Marker 
                key={site.id} 
                position={[parseFloat(site.x_studio_latitude_1!), parseFloat(site.x_studio_longitude_1!)]} 
                icon={createCustomIcon()}
                eventHandlers={{
                    click: () => setSelectedSite(site),
                }}
            />
        ))}
      </MapContainer>

      {/* --- DRAWER LATÉRAL (Inchangé) --- */}
      <AnimatePresence>
        {selectedSite && (
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden flex flex-col border border-slate-100"
            >
                <div className="h-48 bg-slate-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Building2 size={48} opacity={0.5} />
                    </div>
                    <button onClick={() => setSelectedSite(null)} className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
                        <X size={18} />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 rounded-lg shadow-sm">
                        {selectedSite.x_studio_reference_1 || "REF"}
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{selectedSite.x_name}</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-6">
                        <MapPin size={14} /> {selectedSite.x_studio_ville}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-semibold">Superficie</p>
                            <p className="text-lg font-bold text-slate-800">{selectedSite.x_studio_superficie} <span className="text-xs font-normal text-slate-500">m²</span></p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-600 uppercase font-semibold">État</p>
                            <p className="text-sm font-bold text-blue-700">Actif</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <Link href={`/sites`} className="w-full">
                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                            Voir les détails <ArrowRight size={16}/>
                        </button>
                    </Link>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}